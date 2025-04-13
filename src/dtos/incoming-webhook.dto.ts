import { HttpMethod } from '../types/http-method.type'

export interface IncomingWebhookDto {
  url: string
  method: HttpMethod
  params?: Record<string, string>
  headers?: Record<string, string>
  body?: string
}
