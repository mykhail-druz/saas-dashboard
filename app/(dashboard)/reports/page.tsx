"use client"

import { useState } from "react"
import { ReportsTable } from "@/components/tables/reports-table"
import { ReportForm } from "@/components/forms/report-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText } from "lucide-react"
import { Database } from "@/types/database.types"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"

type Report = Database["public"]["Tables"]["reports"]["Row"]

export default function ReportsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [viewingReport, setViewingReport] = useState<Report | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = (report: Report) => {
    setEditingReport(report)
    setIsFormOpen(true)
  }

  const handleView = (report: Report) => {
    setViewingReport(report)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("reports").delete().eq("id", id)

      if (error) {
        toast.error("Failed to delete report", {
          description: error.message,
        })
        return
      }

      toast.success("Report deleted successfully")
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingReport(null)
  }

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Create and manage your analytics reports"
        icon={<FileText className="h-6 w-6" />}
        action={
          <Button
            onClick={() => {
              setEditingReport(null)
              setIsFormOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            View, create, and manage your analytics reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </CardContent>
      </Card>

      <ReportForm
        report={editingReport}
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSuccess={handleSuccess}
      />

      {/* View Report Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingReport?.title}</DialogTitle>
            <DialogDescription>
              {viewingReport?.description || "No description"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-sm">{viewingReport?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm">{viewingReport?.status}</p>
              </div>
            </div>
            {viewingReport?.content && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Content
                </p>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
                  {JSON.stringify(viewingReport.content, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

