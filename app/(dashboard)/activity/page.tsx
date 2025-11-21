import { ActivityLogTable } from "@/components/tables/activity-log-table"
import { PageHeader } from "@/components/page-header"
import { Activity } from "lucide-react"

export default function ActivityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity Log"
        description="View all system activities and events"
        icon={<Activity className="h-6 w-6" />}
      />
      <ActivityLogTable />
    </div>
  )
}

