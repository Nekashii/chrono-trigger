import { createEventHandler } from './handlers/create-event.handler'
import { deleteEventHandler } from './handlers/delete-event.handler'
import { getEventsHandler } from './handlers/get-events.handler'
import { triggerEventHandler } from './handlers/trigger-event.handler'
import { EventService } from './services/event.service'
import { roundToPrecision } from './utils/timestamp.util'

export default {
  async fetch(req, env, ctx) {
    if (req.headers.get('Authorization') !== env.AUTH_TOKEN) return new Response('unauthenticated', { status: 401 })

    const handler: ExportedHandlerFetchHandler<Env> =
      {
        GET: env.PRODUCTION === 'false' ? getEventsHandler : undefined,
        POST: createEventHandler,
        DELETE: deleteEventHandler,
      }[req.method] ?? (() => new Response('method not allowed', { status: 405 }))

    return handler(req, env, ctx)
  },

  async scheduled(event, env): Promise<void> {
    const timestamp = roundToPrecision(event.scheduledTime)

    const eventService = new EventService(env)

    const events = await eventService.getByTimestamp(timestamp)

    await Promise.all([
      ...events.map(event => triggerEventHandler(event, env)),
      eventService.batch(
        events.map(event => {
          const { triggerEvery } = event

          if (triggerEvery) event.nextTriggerAt = timestamp + roundToPrecision(triggerEvery)

          return [event, triggerEvery ? 'update' : 'delete']
        })
      ),
    ])
  },
} satisfies ExportedHandler<Env>
