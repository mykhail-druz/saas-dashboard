"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, Loader2 } from "lucide-react"
import { cacheAvatarUrl, getCachedAvatarUrl } from "@/lib/utils/storage"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "user", "viewer"]).optional(),
  avatar_url: z.string().optional().or(z.literal("")),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface SettingsFormProps {
  profile: Profile | null
  isAdmin?: boolean
}

export function SettingsForm({ profile, isAdmin = false }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      avatar_url: "",
    },
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Try to get from cache first for instant display
        const cachedUrl = getCachedAvatarUrl(user.id)
        if (cachedUrl) {
          setAvatarPreview(cachedUrl)
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) {
          return
        }

        if (profileData) {
          form.reset({
            name: profileData.name || "",
            email: profileData.email || user.email || "",
            role: (profileData.role as any) || "user",
            avatar_url: profileData.avatar_url || "",
          })
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url)
            cacheAvatarUrl(profileData.avatar_url, user.id)
          } else {
            cacheAvatarUrl(null, user.id)
          }
        }
      } catch (error) {
        // Error loading profile
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [form, supabase])

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file format", {
        description: "Only JPEG and PNG files are allowed",
      })
      return
    }

    // Validate file size (1MB)
    const maxSize = 1024 * 1024
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Maximum file size: 1MB",
      })
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error("Failed to upload avatar", {
          description: result.error || "Please try again",
        })
        setAvatarPreview(null)
        return
      }

      // Update form with new avatar URL
      form.setValue("avatar_url", result.url)
      setAvatarPreview(result.url)
      
      // Cache the new avatar URL
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        cacheAvatarUrl(result.url, user.id)
      }
      
      toast.success("Avatar uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload avatar", {
        description: "Please try again",
      })
      setAvatarPreview(null)
    } finally {
      setIsUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to update settings")
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          email: data.email,
          role: data.role,
          avatar_url: data.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        toast.error("Failed to update settings", {
          description: error.message,
        })
        return
      }

      // Update cache with new avatar URL
      if (data.avatar_url) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          cacheAvatarUrl(data.avatar_url, user.id)
        }
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          cacheAvatarUrl(null, user.id)
        }
      }

      toast.success("Settings updated successfully")
      // Refresh page to show updated avatar in UserMenu
      window.location.reload()
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  const initials = form.watch("name")
    ? form
        .watch("name")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    {(avatarPreview || form.watch("avatar_url")) ? (
                      <AvatarImage
                        src={avatarPreview || form.watch("avatar_url") || ""}
                        alt="Avatar"
                      />
                    ) : null}
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleAvatarUpload}
                      disabled={isLoading || isUploadingAvatar}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading || isUploadingAvatar}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingAvatar ? "Uploading..." : "Upload avatar"}
                    </Button>
                    {(avatarPreview || form.watch("avatar_url")) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatarPreview(null)
                          form.setValue("avatar_url", "")
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        disabled={isLoading || isUploadingAvatar}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <FormDescription>
                    Upload an image in JPEG or PNG format (max. 1MB)
                  </FormDescription>
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={() => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isAdmin && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        User role determines access level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}


