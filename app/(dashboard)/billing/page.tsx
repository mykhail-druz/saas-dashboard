import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionsTable } from "@/components/tables/subscriptions-table"
import { SubscriptionsService } from "@/lib/services/subscriptions.service"
import { PlansSection } from "@/components/billing/plans-section"
import { getSubscriptionStatusColor, getPlanColor } from "@/lib/utils/status-colors"
import { formatDateRange } from "@/lib/utils/formatters"
import { CreditCard, Calendar, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's organizations
  let subscription = null
  const subscriptionsService = new SubscriptionsService(supabase)

  if (user?.id) {
    // Try to get subscription by organization first
    const { data: membersData } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()

    if (membersData?.organization_id) {
      subscription = await subscriptionsService.getActiveSubscriptionByOrganizationId(
        membersData.organization_id
      )
    }

    // Fallback to user_id if no organization subscription found
    if (!subscription) {
      subscription = await subscriptionsService.getActiveSubscriptionByUserId(user.id)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Manage your subscription and payment methods"
        icon={<CreditCard className="h-6 w-6" />}
      />

      {/* Current Subscription Card */}
      {subscription ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Your active subscription details
                </CardDescription>
              </div>
              <Badge className={getSubscriptionStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <Badge className={getPlanColor(subscription.plan)}>
                    {subscription.plan}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current Period</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(subscription.current_period_start, subscription.current_period_end)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getSubscriptionStatusColor(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don&apos;t have an active subscription. Choose a plan to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Plans Section */}
      <PlansSection currentSubscription={subscription} />

      {/* All Subscriptions Table (for admins) */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>
            View all your subscription records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable />
        </CardContent>
      </Card>
    </div>
  )
}

