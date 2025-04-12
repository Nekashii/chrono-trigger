import { HttpMethod } from '../types/http-method.type'

export interface IncomingEventDto {
  firstTriggerAt?: number
  triggerEvery?: number
  webhook: {
    url: string
    method: HttpMethod
    params?: Record<string, string>
    headers?: Record<string, string>
    body?: string
  }
}
