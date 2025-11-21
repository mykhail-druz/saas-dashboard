/**
 * Repository for working with subscriptions
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]

export class SubscriptionsRepository extends BaseRepositoryImpl<"subscriptions"> {
  constructor(client: SupabaseClientType) {
    super(client, "subscriptions")
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.findAll({ user_id: userId }, { column: "created_at", ascending: false })
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const subscriptions = await this.findAll({ user_id: userId, status: "active" })
    return subscriptions[0] || null
  }

  async findByStatus(status: string): Promise<Subscription[]> {
    return this.findAll({ status }, { column: "created_at", ascending: false })
  }

  async findByPlan(plan: string): Promise<Subscription[]> {
    return this.findAll({ plan }, { column: "created_at", ascending: false })
  }

  async findActiveByOrganizationId(organizationId: string): Promise<Subscription | null> {
    const subscriptions = await this.findAll(
      { status: "active" },
      { column: "created_at", ascending: false },
      organizationId
    )
    return subscriptions[0] || null
  }
}

