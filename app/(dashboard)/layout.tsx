import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { OrganizationProviderWrapper } from "@/components/organization-provider-wrapper"
import { OrganizationSwitcher } from "@/components/organization-switcher"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
  
  const profile = (profilesData as any)?.find((p: any) => p.id === user.id) || null

  return (
    <OrganizationProviderWrapper>
      <div className="dashboard-layout flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4">
              <div className="flex-1">
                <OrganizationSwitcher />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <ThemeToggle />
                <UserMenu user={user} profile={profile || null} />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="w-full px-4 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </OrganizationProviderWrapper>
  )
}

