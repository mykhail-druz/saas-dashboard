"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { format } from "date-fns"
import { MoreHorizontal, Pencil, UserX, Shield, Trash2 } from "lucide-react"
import { getInitials, formatDate } from "@/lib/utils/formatters"

type User = Database["public"]["Tables"]["users"]["Row"]

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          setError(error.message || "Failed to fetch users")
          throw error
        }
        setUsers(data || [])
        setError(null)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      case "suspended":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "user":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "viewer":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  async function updateUserStatus(userId: string, newStatus: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", userId)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: newStatus as any } : u
        )
      )
      toast.success(`User status updated to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update user status")
    }
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("users")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      )
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      toast.error("Failed to update user role")
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) throw error

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  function handleEdit(user: User) {
    // TODO: Implement edit dialog
    toast.info("Edit functionality coming soon")
  }

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
        <p className="text-destructive font-medium">Error loading users</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <p className="text-xs text-muted-foreground mt-4">
          Make sure you have admin role in your profile to access this page.
        </p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => updateUserStatus(user.id, "active")}
                        disabled={user.status === "active"}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Set Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateUserStatus(user.id, "inactive")}
                        disabled={user.status === "inactive"}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Set Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateUserStatus(user.id, "suspended")}
                        disabled={user.status === "suspended"}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Suspend
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => updateUserRole(user.id, "admin")}
                        disabled={user.role === "admin"}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Set Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateUserRole(user.id, "user")}
                        disabled={user.role === "user"}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Set User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateUserRole(user.id, "viewer")}
                        disabled={user.role === "viewer"}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Set Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteUser(user.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

