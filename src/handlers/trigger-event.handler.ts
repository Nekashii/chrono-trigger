import { Event } from '../models/event.model'

export async function triggerEventHandler({ webhook: { url, method, params, headers, body } }: Event, _env: Env): Promise<any> {
  try {
    await fetch(`${url}${params ? `?${new URLSearchParams(params).toString()}` : ''}`, { method, headers, body })
  } catch (error) {
    return
  }
}
