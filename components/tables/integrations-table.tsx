"use client"

import { useIntegrations } from "@/hooks/use-integrations"
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
import { formatDate, formatDateTime } from "@/lib/utils/formatters"
import { getIntegrationStatusColor, getIntegrationTypeColor } from "@/lib/utils/status-colors"
import { Pencil, Trash2 } from "lucide-react"
import { Database } from "@/types/database.types"

type Integration = Database["public"]["Tables"]["integrations"]["Row"]

interface IntegrationsTableProps {
  onEdit?: (integration: Integration) => void
  onDelete?: (id: string) => void
}

export function IntegrationsTable({ onEdit, onDelete }: IntegrationsTableProps) {
  const { integrations, isLoading, error } = useIntegrations()

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
        <p className="text-destructive font-medium">Error loading integrations</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (integrations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No integrations found. Create your first integration to get started.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell className="font-medium">{integration.name}</TableCell>
              <TableCell>
                <Badge className={getIntegrationTypeColor(integration.type)}>
                  {integration.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getIntegrationStatusColor(integration.status)}>
                  {integration.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {integration.last_sync_at
                  ? formatDateTime(integration.last_sync_at)
                  : "Never"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(integration.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(integration)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(integration.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


