import { IncomingEventDto } from '../dtos/incoming-event.dto'
import { EventService } from '../services/event.service'
import { validateEvent } from '../utils/validators.util'

export const createEventHandler: ExportedHandlerFetchHandler<Env> = async (req, env) => {
  let incomingEvent: IncomingEventDto

  try {
    incomingEvent = await req.json()
    if (!validateEvent(incomingEvent)) return new Response('invalid payload')
  } catch (error) {
    return new Response('missing payload')
  }

  const eventService = new EventService(env)

  const id = await eventService.create(incomingEvent)

  return new Response(id)
}
