import { DbEventDto } from '../dtos/db-event.dto'
import { IncomingEventDto } from '../dtos/incoming-event.dto'
import { EventMapper } from '../mappers/event.mapper'
import { Event } from '../models/event.model'
import { BatchOperation } from '../types/event-operation.type'

export class EventService {
  private readonly db: D1Database

  constructor({ DB }: Env) {
    this.db = DB
  }

  async get(): Promise<Event[]> {
    const res = await this.db
      .prepare(
        `
          SELECT *
          FROM events
        `
      )
      .all<DbEventDto>()

    return res.results.map(EventMapper.fromDb)
  }

  async findById(id: string): Promise<Event | undefined> {
    const event = await this.db
      .prepare(
        `
          SELECT *
          FROM events
          WHERE id = ?
        `
      )
      .bind(id)
      .first<DbEventDto>()

    return event ? EventMapper.fromDb(event) : undefined
  }

  async getByTimestamp(timestamp: number): Promise<Event[]> {
    const res = await this.db
      .prepare(
        `
          SELECT *
          FROM events
          WHERE next_trigger_at = ?
        `
      )
      .bind(timestamp)
      .all<DbEventDto>()

    return res.results.map(EventMapper.fromDb)
  }

  async create(incomingEvent: IncomingEventDto): Promise<string> {
    const {
      id,
      first_trigger_at,
      next_trigger_at,
      trigger_every,
      webhook_url,
      webhook_method,
      webhook_params,
      webhook_headers,
      webhook_body,
    } = EventMapper.fromIncomingToDb(crypto.randomUUID(), incomingEvent)

    const res = await this.db
      .prepare(
        `
          INSERT INTO events (
            id,
            first_trigger_at,
            next_trigger_at,
            trigger_every,
            webhook_url,
            webhook_method,
            webhook_params,
            webhook_headers,
            webhook_body
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        id,
        first_trigger_at,
        next_trigger_at,
        trigger_every,
        webhook_url,
        webhook_method,
        webhook_params,
        webhook_headers,
        webhook_body
      )
      .run()

    return id
  }

  private prepareUpdate(event: Event): D1PreparedStatement {
    const {
      id,
      first_trigger_at,
      next_trigger_at,
      trigger_every,
      webhook_url,
      webhook_method,
      webhook_params,
      webhook_headers,
      webhook_body,
    } = EventMapper.toDb(event)
    return this.db
      .prepare(
        `
          UPDATE events
          SET first_trigger_at = ?
          SET next_trigger_at = ?
          SET trigger_every = ?
          SET webhook_url = ?
          SET webhook_method = ?
          SET webhook_params = ?
          SET webhook_headers = ?
          SET webhook_body = ?
          WHERE id = ?
        `
      )
      .bind(
        first_trigger_at,
        next_trigger_at,
        trigger_every,
        webhook_url,
        webhook_method,
        webhook_params,
        webhook_headers,
        webhook_body,
        id
      )
  }

  private prepareDelete(id: string): D1PreparedStatement {
    return this.db
      .prepare(
        `
          DELETE FROM events
          WHERE id = ?
        `
      )
      .bind(id)
  }

  async update(event: Event): Promise<void> {
    await this.prepareUpdate(event).run()
  }

  async delete(id: string): Promise<void> {
    await this.prepareDelete(id).run()
  }

  async batch(tasks: [Event, BatchOperation][]): Promise<void> {
    await this.db.batch(
      tasks.map(
        ([event, operation]) =>
          ((
            {
              update: this.prepareUpdate(event),
              delete: this.prepareDelete(event.id),
            } as Record<BatchOperation, D1PreparedStatement>
          )[operation])
      )
    )
  }
}
