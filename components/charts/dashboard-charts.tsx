"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Database } from "@/types/database.types"

type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"]

interface DashboardChartsProps {
  revenueData: AnalyticsEvent[]
  trafficData: AnalyticsEvent[]
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"]

export function DashboardCharts({ revenueData, trafficData }: DashboardChartsProps) {
  // Format data for charts
  const revenueChartData = revenueData.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Number(item.value) || 0,
  }))

  const trafficChartData = trafficData.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Number(item.value) || 0,
  }))

  // Sample data for bar and pie charts
  const topUsersData = [
    { name: "John Doe", value: 450 },
    { name: "Jane Smith", value: 380 },
    { name: "Bob Johnson", value: 320 },
    { name: "Alice Williams", value: 280 },
    { name: "Charlie Brown", value: 240 },
  ]

  const categoryData = [
    { name: "Sales", value: 45 },
    { name: "Marketing", value: 30 },
    { name: "Support", value: 15 },
    { name: "Other", value: 10 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Revenue Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Revenue over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Website traffic over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trafficChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Traffic"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Users Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users</CardTitle>
          <CardDescription>Most active users this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Activity" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

