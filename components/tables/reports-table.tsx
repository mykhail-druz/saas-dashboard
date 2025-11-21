"use client"

import { useState } from "react"
import { useReports } from "@/hooks/useReports"
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
import { formatDate, truncateText } from "@/lib/utils/formatters"
import { getReportStatusColor, getReportTypeColor } from "@/lib/utils/status-colors"
import { Pencil, Trash2, Eye } from "lucide-react"
import { Database } from "@/types/database.types"

type Report = Database["public"]["Tables"]["reports"]["Row"]

interface ReportsTableProps {
  onEdit?: (report: Report) => void
  onDelete?: (id: string) => void
  onView?: (report: Report) => void
}

export function ReportsTable({ onEdit, onDelete, onView }: ReportsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filters = {
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  }

  const { reports, isLoading, error } = useReports({ filters })

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
        <p className="text-destructive font-medium">Error loading reports</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reports found. Create your first report to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="all">All Types</option>
          <option value="sales">Sales</option>
          <option value="traffic">Traffic</option>
          <option value="revenue">Revenue</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>
                  <Badge className={getReportTypeColor(report.type)}>
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getReportStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {report.description ? truncateText(report.description, 50) : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(report.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(report)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(report.id)}
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
    </div>
  )
}


