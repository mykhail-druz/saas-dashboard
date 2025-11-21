import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCharts } from "@/components/charts/dashboard-charts"
import { RecentActivity } from "@/components/tables/recent-activity"
import { AnalyticsService } from "@/lib/services/analytics.service"
import { UsersService } from "@/lib/services/users.service"
import { ReportsService } from "@/lib/services/reports.service"
import { DollarSign, Users, FileText, TrendingUp, LayoutDashboard } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Use services to fetch data
  const analyticsService = new AnalyticsService(supabase)
  const usersService = new UsersService(supabase)
  const reportsService = new ReportsService(supabase)

  // Get dashboard metrics
  const metrics = await analyticsService.getDashboardMetrics(60)
  const { revenueData, trafficData, totalRevenue, totalTraffic } = metrics

  // Get counts
  const userCount = await usersService.getUserCount()
  const reportCount = await reportsService.getReportCount()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your analytics."
        icon={<LayoutDashboard className="h-6 w-6" />}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString("en-US")}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              +5 new users this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              3 published this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Traffic</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTraffic.toLocaleString("en-US")}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts revenueData={revenueData || []} trafficData={trafficData || []} />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions and events in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  )
}

