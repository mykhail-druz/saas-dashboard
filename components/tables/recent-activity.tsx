"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"
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
import { formatDistanceToNow } from "date-fns"
import { useOrganization } from "@/lib/contexts/OrganizationContext"

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"]

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { currentOrganization } = useOrganization()

  useEffect(() => {
    async function fetchActivities() {
      if (!currentOrganization) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("organization_id", currentOrganization.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error
        setActivities(data || [])
      } catch (error) {
        // Error fetching activities
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [supabase, currentOrganization])

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "update":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "delete":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "login":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>Resource</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell>
              <Badge className={getActionColor(activity.action)}>
                {activity.action}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {activity.resource_type}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {activity.details ? JSON.stringify(activity.details) : "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

