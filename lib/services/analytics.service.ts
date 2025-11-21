/**
 * Service for working with analytics (business logic)
 */

import { AnalyticsRepository } from "@/lib/repositories/analytics.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"
import { Database } from "@/types/database.types"

type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"]
type AnalyticsEventInsert = Database["public"]["Tables"]["analytics_events"]["Insert"]

export interface AnalyticsMetrics {
  totalRevenue: number
  totalTraffic: number
  revenueData: AnalyticsEvent[]
  trafficData: AnalyticsEvent[]
}

export class AnalyticsService {
  private repository: AnalyticsRepository

  constructor(client: SupabaseClientType) {
    this.repository = new AnalyticsRepository(client)
  }

  async getAllEvents(limit?: number): Promise<AnalyticsEvent[]> {
    if (limit) {
      return this.repository.getRecentEvents(limit)
    }
    return this.repository.findAll(undefined, { column: "created_at", ascending: true })
  }

  async getEventById(id: string): Promise<AnalyticsEvent | null> {
    return this.repository.findById(id)
  }

  async getEventsByType(eventType: string, limit?: number): Promise<AnalyticsEvent[]> {
    return this.repository.findByEventType(eventType, limit)
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsEvent[]> {
    return this.repository.getEventsByDateRange(startDate, endDate)
  }

  async createEvent(data: AnalyticsEventInsert): Promise<AnalyticsEvent> {
    return this.repository.create(data)
  }

  /**
   * Get metrics for dashboard (revenue and traffic)
   */
  async getDashboardMetrics(limit: number = 60): Promise<AnalyticsMetrics> {
    const revenueData = await this.repository.findByEventType("revenue", limit)
    const trafficData = await this.repository.findByEventType("traffic", limit)

    const totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
    const totalTraffic = trafficData.reduce((sum, item) => sum + (Number(item.value) || 0), 0)

    return {
      totalRevenue,
      totalTraffic,
      revenueData,
      trafficData,
    }
  }

  async getRevenueData(limit?: number): Promise<AnalyticsEvent[]> {
    return this.repository.findByEventType("revenue", limit)
  }

  async getTrafficData(limit?: number): Promise<AnalyticsEvent[]> {
    return this.repository.findByEventType("traffic", limit)
  }
}

