import { EventService } from '../services/event.service'

export const getEventsHandler: ExportedHandlerFetchHandler<Env> = async (req, env) => {
  const eventService = new EventService(env)
  const [, id] = new URL(req.url).pathname.split('/')

  if (!id) return Response.json(await eventService.get())

  const event = await eventService.findById(id)

  if (!event) return new Response(undefined, { status: 404 })

  return Response.json(event)
}
