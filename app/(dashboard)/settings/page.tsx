import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/forms/settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Settings } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Settings"
          description="Manage your account settings and preferences"
          icon={<Settings className="h-6 w-6" />}
        />
        <div className="text-center py-12 text-muted-foreground">
          Please log in to view settings
        </div>
      </div>
    )
  }

  // Get user profile (using direct query for now, as profiles are not in repositories)
  // In the future, we can add ProfilesRepository and ProfilesService
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const profile = profileData || null
  const isAdmin = profile?.role === "admin"

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />

      <SettingsForm profile={profile} isAdmin={isAdmin} />
    </div>
  )
}

