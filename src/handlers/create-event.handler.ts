import { IncomingEventDto } from '../dtos/incoming-event.dto'
import { EventService } from '../services/event.service'
import { roundToPrecision } from '../utils/timestamp.util'
import { validateEvent } from '../utils/validators.util'

export const createEventHandler: ExportedHandlerFetchHandler<Env> = async (req, env) => {
  let incomingEvent: IncomingEventDto

  try {
    incomingEvent = await req.json()
    if (!validateEvent(incomingEvent)) return new Response('invalid payload')
  } catch (error) {
    return new Response('missing payload')
  }

  if (incomingEvent.firstTriggerAt && roundToPrecision(incomingEvent.firstTriggerAt) < roundToPrecision(new Date().getTime(), 'ceil'))
    return new Response('past event', { status: 400 })

  const eventService = new EventService(env)

  const id = await eventService.create(incomingEvent)

  return new Response(id)
}
