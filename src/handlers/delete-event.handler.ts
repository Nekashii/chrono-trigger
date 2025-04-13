import { EventService } from '../services/event.service'

export const deleteEventHandler: ExportedHandlerFetchHandler<Env> = async (req, env) => {
  const [, id] = new URL(req.url).pathname.split('/')

  if (!id) return new Response('not found', { status: 404 })

  const eventService = new EventService(env)

  await eventService.delete(id)

  return new Response('deleted')
}
