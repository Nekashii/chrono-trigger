import { IncomingWebhookDto } from '../dtos/incoming-webhook.dto'
import { Webhook } from '../models/webhook.model'

export abstract class WebhookMapper {
  static fromIncoming({ url, method, params, headers, body }: IncomingWebhookDto): Webhook {
    return new Webhook(url, method, params, headers, body)
  }
}
