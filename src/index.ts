import { createEventHandler } from './handlers/create-event.handler'
import { deleteEventHandler } from './handlers/delete-event.handler'
import { getEventsHandler } from './handlers/get-events.handler'

export default {
  async fetch(req, env, ctx) {
    const handler: ExportedHandlerFetchHandler<Env> =
      {
        GET: env.PRODUCTION === 'false' ? getEventsHandler : undefined,
        POST: createEventHandler,
        DELETE: deleteEventHandler,
      }[req.method] ?? (() => new Response(undefined, { status: 405 }))

    return handler(req, env, ctx)
  },

  async scheduled(event, env, ctx): Promise<void> {
    const time = Math.round(event.scheduledTime / 60 / 15) * 60 * 15
    console.log(time)
  },
} satisfies ExportedHandler<Env>
