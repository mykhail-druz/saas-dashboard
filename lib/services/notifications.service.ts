/**
 * Service for working with notifications (business logic)
 */

import { NotificationsRepository } from "@/lib/repositories/notifications.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"
import { Database } from "@/types/database.types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]
type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]

export interface NotificationFilters {
  read?: boolean
}

export class NotificationsService {
  private repository: NotificationsRepository

  constructor(client: SupabaseClientType) {
    this.repository = new NotificationsRepository(client)
  }

  async getNotificationsByUserId(userId: string, filters?: NotificationFilters): Promise<Notification[]> {
    return this.repository.findByUserId(userId, filters)
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return this.repository.findById(id)
  }

  async createNotification(data: NotificationInsert): Promise<Notification> {
    return this.repository.create(data)
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.repository.markAsRead(id)
  }

  async markAsUnread(id: string): Promise<Notification> {
    return this.repository.markAsUnread(id)
  }

  async deleteNotification(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repository.getUnreadCount(userId)
  }

  async getTotalCount(userId: string): Promise<number> {
    return this.repository.getTotalCount(userId)
  }

  async getAllNotifications(userId: string): Promise<Notification[]> {
    return this.repository.findByUserId(userId)
  }

  async getReadNotifications(userId: string): Promise<Notification[]> {
    return this.repository.findByUserId(userId, { read: true })
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.repository.findByUserId(userId, { read: false })
  }
}

