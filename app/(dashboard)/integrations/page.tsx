"use client"

import { useState } from "react"
import { IntegrationsTable } from "@/components/tables/integrations-table"
import { IntegrationForm } from "@/components/forms/integration-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Plug } from "lucide-react"
import { Database } from "@/types/database.types"
import { toast } from "sonner"
import { useIntegrations } from "@/hooks/use-integrations"
import { PageHeader } from "@/components/page-header"

type Integration = Database["public"]["Tables"]["integrations"]["Row"]

export default function IntegrationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)
  const { refetch, deleteIntegration } = useIntegrations()

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this integration?")) {
      return
    }

    try {
      await deleteIntegration(id)
      toast.success("Integration deleted successfully")
      refetch()
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred"
      toast.error("Failed to delete integration", {
        description: message,
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingIntegration(null)
  }

  const handleSuccess = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Integrations"
        description="Manage your API integrations and keys"
        icon={<Plug className="h-6 w-6" />}
        action={
          <Button
            onClick={() => {
              setEditingIntegration(null)
              setIsFormOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Integrations</CardTitle>
          <CardDescription>
            View and manage all your connected integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IntegrationsTable
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <IntegrationForm
        integration={editingIntegration}
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

