"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOrganization } from "@/lib/contexts/organization-context";
import { OrganizationMembersService } from "@/lib/services/organization-members.service";
import type { OrganizationMemberWithProfile } from "@/lib/repositories/organization-members.repository";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, UserX, Shield } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils/formatters";

export function OrganizationMembersTable() {
  const [members, setMembers] = useState<OrganizationMemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganization, canManageUsers, refreshOrganizations } =
    useOrganization();
  const supabase = createClient();
  const membersService = useMemo(
    () => new OrganizationMembersService(supabase),
    [supabase]
  );

  useEffect(() => {
    if (!currentOrganization) {
      setIsLoading(false);
      return;
    }

    const organizationId = currentOrganization.id;

    async function fetchMembers() {
      try {
        const membersData = await membersService.getOrganizationMembers(
          organizationId
        );
        setMembers(membersData);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [currentOrganization, membersService]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "admin":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "member":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "viewer":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  async function updateMemberRole(
    memberId: string,
    newRole: "admin" | "member" | "viewer"
  ) {
    try {
      await membersService.updateMemberRole(memberId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      toast.success(`Member role updated to ${newRole}`);
      await refreshOrganizations();
    } catch {
      toast.error("Failed to update member role");
    }
  }

  async function removeMember(memberId: string) {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }

    try {
      await membersService.removeMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Member removed successfully");
      await refreshOrganizations();
    } catch {
      toast.error("Failed to remove member");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive font-medium">Error loading members</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No members found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            {canManageUsers && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const profile = member.profiles;
            const displayName = profile?.name || profile?.email || "Unknown";
            const email = profile?.email || "No email";

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{displayName}</span>
                  </div>
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(member.joined_at)}
                </TableCell>
                {canManageUsers && member.role !== "owner" && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateMemberRole(member.id, "admin")}
                          disabled={member.role === "admin"}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Set Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateMemberRole(member.id, "member")}
                          disabled={member.role === "member"}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Set Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateMemberRole(member.id, "viewer")}
                          disabled={member.role === "viewer"}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Set Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => removeMember(member.id)}
                          className="text-destructive"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
                {canManageUsers && member.role === "owner" && (
                  <TableCell className="text-right text-muted-foreground text-sm">
                    Owner
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
