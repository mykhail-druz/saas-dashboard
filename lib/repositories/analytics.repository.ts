/**
 * Repository for working with analytics
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"]

export class AnalyticsRepository extends BaseRepositoryImpl<"analytics_events"> {
  constructor(client: SupabaseClientType) {
    super(client, "analytics_events")
  }

  async findByEventType(eventType: string, limit?: number): Promise<AnalyticsEvent[]> {
    let query = this.client
      .from("analytics_events")
      .select("*")
      .eq("event_type", eventType)
      .order("created_at", { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch analytics events by type: ${error.message}`)
    }

    return (data || []) as AnalyticsEvent[]
  }

  async getRecentEvents(limit: number = 100): Promise<AnalyticsEvent[]> {
    return this.findAll(undefined, { column: "created_at", ascending: false })
      .then((events) => events.slice(0, limit))
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsEvent[]> {
    const { data, error } = await this.client
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch analytics events by date range: ${error.message}`)
    }

    return (data || []) as AnalyticsEvent[]
  }
}

