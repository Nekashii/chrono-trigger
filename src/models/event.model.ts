import { Webhook } from './webhook.model'

export class Event {
  constructor(
    public readonly id: string,
    public readonly firstTriggerAt: number | undefined,
    public nextTriggerAt: number,
    public readonly triggerEvery: number | undefined,
    public readonly webhook: Webhook
  ) {}
}
