"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { useReports } from "@/hooks/use-reports"
import { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

type Report = Database["public"]["Tables"]["reports"]["Row"]

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["sales", "traffic", "revenue", "custom"]),
  status: z.enum(["draft", "published", "archived"]),
})

type ReportFormValues = z.infer<typeof reportSchema>

interface ReportFormProps {
  report?: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReportForm({
  report,
  open,
  onOpenChange,
  onSuccess,
}: ReportFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "custom",
      status: "draft",
    },
  })

  useEffect(() => {
    if (report) {
      form.reset({
        title: report.title,
        description: report.description || "",
        type: report.type as any,
        status: report.status as any,
      })
    } else {
      form.reset({
        title: "",
        description: "",
        type: "custom",
        status: "draft",
      })
    }
  }, [report, form])

  const { createReport, updateReport } = useReports({ autoFetch: false })

  async function onSubmit(data: ReportFormValues) {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (report) {
        // Update existing report
        await updateReport(report.id, {
          title: data.title,
          description: data.description || null,
          type: data.type,
          status: data.status,
        })
        toast.success("Report updated successfully")
      } else {
        // Create new report
        await createReport({
          title: data.title,
          description: data.description || null,
          type: data.type,
          status: data.status,
          created_by: user?.id || null,
        })
        toast.success("Report created successfully")
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred"
      toast.error("Failed to save report", {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {report ? "Edit Report" : "Create Report"}
          </DialogTitle>
          <DialogDescription>
            {report
              ? "Update the report details below."
              : "Create a new analytics report."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Monthly Sales Report"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Report description..."
                      disabled={isLoading}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for this report
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? report
                    ? "Updating..."
                    : "Creating..."
                  : report
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


