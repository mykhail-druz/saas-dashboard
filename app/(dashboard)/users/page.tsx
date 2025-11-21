"use client"

import { useState } from "react"
import { OrganizationMembersTable } from "@/components/tables/organization-members-table"
import { InviteUserDialog } from "@/components/forms/invite-user-dialog"
import { Button } from "@/components/ui/button"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import { UserPlus, Users } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function UsersPage() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const { canManageUsers } = useOrganization()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team Members"
        description="Manage your organization members and their permissions"
        icon={<Users className="h-6 w-6" />}
        action={
          canManageUsers ? (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          ) : undefined
        }
      />
      <OrganizationMembersTable />
      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onSuccess={() => {
          // Table will refresh automatically via context
        }}
      />
    </div>
  )
}

