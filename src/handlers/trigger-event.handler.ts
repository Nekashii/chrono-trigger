import { Webhook } from '../models/webhook.model'

export async function triggerEventHandler({ url, method, params, headers, body }: Webhook, _env: Env): Promise<any> {
  try {
    await fetch(`${url}${params ? `?${new URLSearchParams(params).toString()}` : ''}`, { method, headers, body })
  } catch (error) {
    return
  }
}
