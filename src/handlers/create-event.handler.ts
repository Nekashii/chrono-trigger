import { IncomingEventDto } from '../dtos/incoming-event.dto'
import { WebhookMapper } from '../mappers/webhook.mapper'
import { EventService } from '../services/event.service'
import { roundToPrecision } from '../utils/timestamp.util'
import { validateEvent } from '../utils/validators.util'
import { triggerEventHandler } from './trigger-event.handler'

export const createEventHandler: ExportedHandlerFetchHandler<Env> = async (req, env) => {
  let incomingEvent: IncomingEventDto

  try {
    incomingEvent = await req.json()
    if (!validateEvent(incomingEvent)) return new Response('invalid payload', { status: 400 })
  } catch (error) {
    return new Response('missing payload', { status: 400 })
  }

  if (incomingEvent.firstTriggerAt && roundToPrecision(incomingEvent.firstTriggerAt) < roundToPrecision(new Date().getTime(), 'ceil'))
    return new Response('past event', { status: 400 })

  const eventService = new EventService(env)

  const [id] = await Promise.all([
    eventService.create(incomingEvent),
    ...(incomingEvent.firstTriggerAt ? [] : [triggerEventHandler(WebhookMapper.fromIncoming(incomingEvent.webhook), env)]),
  ])

  return new Response(id)
}
