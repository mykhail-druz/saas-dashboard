/**
 * React hook for working with notifications
 */

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { NotificationsService } from "@/lib/services/notifications.service"
import { Database } from "@/types/database.types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export interface UseNotificationsOptions {
  userId?: string
  filters?: { read?: boolean }
  autoFetch?: boolean
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { userId, filters, autoFetch = true } = options
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchNotifications = async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const client = createClient()
      const service = new NotificationsService(client)
      
      const [data, unread, total] = await Promise.all([
        service.getNotificationsByUserId(userId, filters),
        service.getUnreadCount(userId),
        service.getTotalCount(userId),
      ])
      
      setNotifications(data)
      setUnreadCount(unread)
      setTotalCount(total)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch notifications"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchNotifications()
    }
  }, [userId, filters?.read, autoFetch])

  const markAsRead = async (id: string) => {
    try {
      const client = createClient()
      const service = new NotificationsService(client)
      await service.markAsRead(id)
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to mark as read"
      setError(message)
      throw err
    }
  }

  const markAsUnread = async (id: string) => {
    try {
      const client = createClient()
      const service = new NotificationsService(client)
      await service.markAsUnread(id)
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      )
      setUnreadCount((prev) => prev + 1)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to mark as unread"
      setError(message)
      throw err
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const client = createClient()
      const service = new NotificationsService(client)
      await service.deleteNotification(id)
      
      const deleted = notifications.find((n) => n.id === id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
      setTotalCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete notification"
      setError(message)
      throw err
    }
  }

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    totalCount,
    refetch: fetchNotifications,
    markAsRead,
    markAsUnread,
    deleteNotification,
  }
}

