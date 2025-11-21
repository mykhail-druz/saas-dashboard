"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { SubscriptionsService } from "@/lib/services/subscriptions.service"
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
import { formatDate } from "@/lib/utils/formatters"
import { getSubscriptionStatusColor, getPlanColor } from "@/lib/utils/status-colors"
import { Database } from "@/types/database.types"

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]

export function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const client = createClient()
        const service = new SubscriptionsService(client)
        const data = await service.getAllSubscriptions()
        setSubscriptions(data)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch subscriptions"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive font-medium">Error loading subscriptions</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No subscriptions found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Period</TableHead>
            <TableHead>Period End</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>
                <Badge className={getPlanColor(subscription.plan)}>
                  {subscription.plan}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getSubscriptionStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(subscription.current_period_start)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(subscription.current_period_end)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(subscription.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


