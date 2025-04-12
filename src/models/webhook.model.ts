import { HttpMethod } from '../types/http-method.type'

export class Webhook {
  constructor(
    public readonly url: string,
    public readonly method: HttpMethod,
    public readonly params: Record<string, string> | undefined,
    public readonly headers: Record<string, string> | undefined,
    public readonly body: string | undefined
  ) {}
}
