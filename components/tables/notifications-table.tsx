"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useNotifications } from "@/hooks/useNotifications"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils/formatters"
import { getNotificationTypeColor } from "@/lib/utils/status-colors"
import { Check, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NotificationsTable() {
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function getUserId() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUserId()
  }, [])

  const filters = filter === "all" ? undefined : { read: filter === "read" }
  const {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    deleteNotification,
  } = useNotifications({ userId: userId || undefined, filters, autoFetch: !!userId })

  async function toggleRead(id: string, currentRead: boolean) {
    try {
      if (currentRead) {
        await markAsUnread(id)
        toast.success("Marked as unread")
      } else {
        await markAsRead(id)
        toast.success("Marked as read")
      }
    } catch (error) {
      toast.error("Failed to update notification")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return
    }

    try {
      await deleteNotification(id)
      toast.success("Notification deleted")
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notifications found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={(value: "all" | "read" | "unread") => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow
                key={notification.id}
                className={notification.read ? "opacity-60" : ""}
              >
                <TableCell>
                  <Badge className={getNotificationTypeColor(notification.type)}>
                    {notification.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {notification.title}
                </TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {notification.message}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={notification.read ? "outline" : "default"}
                    className={notification.read ? "" : "bg-primary"}
                  >
                    {notification.read ? "Read" : "Unread"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatRelativeTime(notification.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRead(notification.id, notification.read)}
                      title={notification.read ? "Mark as unread" : "Mark as read"}
                    >
                      {notification.read ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


