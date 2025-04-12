import { HTTP_METHODS } from '../types/http-method.type'

export function validateEvent(event: any) {
  if (typeof event !== 'object' || event === null) return false

  if ('firstTriggerAt' in event && typeof event.firstTriggerAt !== 'number') return false
  if ('triggerEvery' in event && typeof event.triggerEvery !== 'number') return false
  if (!(event.firstTriggerAt || event.triggerEvery)) return false

  const webhook = event.webhook

  if (typeof webhook !== 'object' || webhook === null) return false

  if (typeof webhook.url !== 'string') return false
  if (!HTTP_METHODS.includes(webhook.method)) return false
  if ('params' in webhook && typeof webhook.params !== 'object') return false
  if ('headers' in webhook && typeof webhook.headers !== 'object') return false
  if ('body' in webhook && typeof webhook.body !== 'string') return false

  return true
}
