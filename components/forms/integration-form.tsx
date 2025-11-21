"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useIntegrations } from "@/hooks/useIntegrations"
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

type Integration = Database["public"]["Tables"]["integrations"]["Row"]

const integrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["stripe", "sendgrid", "aws", "slack", "github", "custom"]),
  status: z.enum(["active", "inactive", "error"]),
  api_key: z.string().optional(),
})

type IntegrationFormValues = z.infer<typeof integrationSchema>

interface IntegrationFormProps {
  integration?: Integration | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function IntegrationForm({
  integration,
  open,
  onOpenChange,
  onSuccess,
}: IntegrationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createIntegration, updateIntegration } = useIntegrations()

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      name: "",
      type: "custom",
      status: "inactive",
      api_key: "",
    },
  })

  useEffect(() => {
    if (integration) {
      form.reset({
        name: integration.name,
        type: integration.type as any,
        status: integration.status as any,
        api_key: integration.api_key || "",
      })
    } else {
      form.reset({
        name: "",
        type: "custom",
        status: "inactive",
        api_key: "",
      })
    }
  }, [integration, form])

  async function onSubmit(data: IntegrationFormValues) {
    setIsLoading(true)
    try {
      if (integration) {
        // Update existing integration
        await updateIntegration(integration.id, {
          name: data.name,
          type: data.type,
          status: data.status,
          api_key: data.api_key || null,
        })
        toast.success("Integration updated successfully")
      } else {
        // Create new integration
        await createIntegration({
          name: data.name,
          type: data.type,
          status: data.status,
          api_key: data.api_key || null,
        })
        toast.success("Integration created successfully")
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred"
      toast.error("Failed to save integration", {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {integration ? "Edit Integration" : "Create Integration"}
          </DialogTitle>
          <DialogDescription>
            {integration
              ? "Update the integration details below."
              : "Add a new integration to connect with external services."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Integration"
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
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter API key (optional)"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    API key will be stored securely
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  ? integration
                    ? "Updating..."
                    : "Creating..."
                  : integration
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


