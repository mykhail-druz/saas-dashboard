/**
 * Service for working with subscriptions (business logic)
 */

import { SubscriptionsRepository } from "@/lib/repositories/subscriptions.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"
import { Database } from "@/types/database.types"

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"]
type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"]

export class SubscriptionsService {
  private repository: SubscriptionsRepository

  constructor(client: SupabaseClientType) {
    this.repository = new SubscriptionsRepository(client)
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.repository.findAll(undefined, { column: "created_at", ascending: false })
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    return this.repository.findById(id)
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription[]> {
    return this.repository.findByUserId(userId)
  }

  async getActiveSubscriptionByUserId(userId: string): Promise<Subscription | null> {
    return this.repository.findActiveByUserId(userId)
  }

  async createSubscription(data: SubscriptionInsert): Promise<Subscription> {
    return this.repository.create(data)
  }

  async updateSubscription(id: string, data: SubscriptionUpdate): Promise<Subscription> {
    return this.repository.update(id, {
      ...data,
      updated_at: new Date().toISOString(),
    })
  }

  async deleteSubscription(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  async getSubscriptionsByStatus(status: string): Promise<Subscription[]> {
    return this.repository.findByStatus(status)
  }

  async getSubscriptionsByPlan(plan: string): Promise<Subscription[]> {
    return this.repository.findByPlan(plan)
  }

  async getActiveSubscriptionByOrganizationId(organizationId: string): Promise<Subscription | null> {
    return this.repository.findActiveByOrganizationId(organizationId)
  }

  async activatePlan(
    plan: string,
    userId: string,
    organizationId: string
  ): Promise<Subscription> {
    // Validate plan
    const validPlans = ["free", "pro", "enterprise"]
    if (!validPlans.includes(plan)) {
      throw new Error(`Invalid plan: ${plan}. Must be one of: ${validPlans.join(", ")}`)
    }

    // Get current active subscription for organization
    const activeSubscription = await this.getActiveSubscriptionByOrganizationId(organizationId)

    // If already on this plan, return existing subscription
    if (activeSubscription && activeSubscription.plan === plan) {
      return activeSubscription
    }

    // Cancel old active subscription if exists
    if (activeSubscription) {
      await this.updateSubscription(activeSubscription.id, {
        status: "canceled",
      })
    }

    // Calculate period dates
    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setDate(periodEnd.getDate() + 30) // 30 days subscription period

    // Create new subscription
    const newSubscription = await this.createSubscription({
      user_id: userId,
      organization_id: organizationId,
      plan: plan as "free" | "pro" | "enterprise",
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    })

    return newSubscription
  }
}

