import { DbEventDto } from '../dtos/db-event.dto'
import { IncomingEventDto } from '../dtos/incoming-event.dto'
import { Event } from '../models/event.model'
import { Webhook } from '../models/webhook.model'
import { roundToPrecision } from '../utils/timestamp.util'

export abstract class EventMapper {
  static fromDb({
    id,
    first_trigger_at,
    next_trigger_at,
    trigger_every,
    webhook_url,
    webhook_method,
    webhook_params,
    webhook_headers,
    webhook_body,
  }: DbEventDto): Event {
    return new Event(
      id,
      first_trigger_at ?? undefined,
      next_trigger_at,
      trigger_every ?? undefined,
      new Webhook(
        webhook_url,
        webhook_method,
        webhook_params ? JSON.parse(webhook_params) : undefined,
        webhook_headers ? JSON.parse(webhook_headers) : undefined,
        webhook_body ?? undefined
      )
    )
  }

  static toDb({ id, firstTriggerAt, nextTriggerAt, triggerEvery, webhook: { url, method, params, headers, body } }: Event): DbEventDto {
    return {
      id: id,
      first_trigger_at: firstTriggerAt ?? null,
      next_trigger_at: nextTriggerAt,
      trigger_every: triggerEvery ?? null,
      webhook_url: url,
      webhook_method: method,
      webhook_params: params ? JSON.stringify(params) : null,
      webhook_headers: headers ? JSON.stringify(headers) : null,
      webhook_body: body ?? null,
    }
  }

  static fromIncomingToDb(
    id: string,
    { firstTriggerAt, triggerEvery, webhook: { url, method, params, headers, body } }: IncomingEventDto
  ): DbEventDto {
    const now = new Date().getTime()
    return {
      id: id,
      first_trigger_at: firstTriggerAt ?? null,
      next_trigger_at: roundToPrecision(firstTriggerAt ?? now + triggerEvery!),
      trigger_every: triggerEvery ?? null,
      webhook_url: url,
      webhook_method: method,
      webhook_params: params ? JSON.stringify(params) : null,
      webhook_headers: headers ? JSON.stringify(headers) : null,
      webhook_body: body ?? null,
    }
  }
}
