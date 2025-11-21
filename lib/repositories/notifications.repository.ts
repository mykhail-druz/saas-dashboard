/**
 * Repository for working with notifications
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export class NotificationsRepository extends BaseRepositoryImpl<"notifications"> {
  constructor(client: SupabaseClientType) {
    super(client, "notifications")
  }

  async findByUserId(userId: string, filters?: { read?: boolean }): Promise<Notification[]> {
    const queryFilters: Record<string, unknown> = { user_id: userId }
    
    if (filters?.read !== undefined) {
      queryFilters.read = filters.read
    }

    return this.findAll(queryFilters, { column: "created_at", ascending: false })
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { read: true } as Database["public"]["Tables"]["notifications"]["Update"])
  }

  async markAsUnread(id: string): Promise<Notification> {
    return this.update(id, { read: false } as Database["public"]["Tables"]["notifications"]["Update"])
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.count({ user_id: userId, read: false })
  }

  async getTotalCount(userId: string): Promise<number> {
    return this.count({ user_id: userId })
  }
}

