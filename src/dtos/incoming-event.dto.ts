import { IncomingWebhookDto } from './incoming-webhook.dto'

export interface IncomingEventDto {
  firstTriggerAt?: number
  triggerEvery?: number
  webhook: IncomingWebhookDto
}
