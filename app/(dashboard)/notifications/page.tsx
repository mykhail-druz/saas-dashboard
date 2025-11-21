import { createClient } from "@/lib/supabase/server";
import { NotificationsTable } from "@/components/tables/notifications-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationsService } from "@/lib/services/notifications.service";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Notifications"
          description="View and manage your notifications"
          icon={<Bell className="h-6 w-6" />}
        />
        <div className="text-center py-12 text-muted-foreground">
          Please log in to view notifications
        </div>
      </div>
    );
  }

  // Use service to get notification counts
  const notificationsService = new NotificationsService(supabase);
  const unreadCount = await notificationsService.getUnreadCount(user.id);
  const totalCount = await notificationsService.getTotalCount(user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description="View and manage your notifications"
        icon={<Bell className="h-6 w-6" />}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Notifications
            </CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              All your notifications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Manage and filter your notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsTable />
        </CardContent>
      </Card>
    </div>
  );
}
