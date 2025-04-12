import { HttpMethod } from '../types/http-method.type'

export interface DbEventDto {
  id: string
  first_trigger_at: number | null
  next_trigger_at: number
  trigger_every: number | null
  webhook_url: string
  webhook_method: HttpMethod
  webhook_params: string | null
  webhook_headers: string | null
  webhook_body: string | null
}
