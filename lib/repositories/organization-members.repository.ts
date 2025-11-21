/**
 * Repository for working with organization members
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type OrganizationMember = Database["public"]["Tables"]["organization_members"]["Row"]
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type OrganizationMemberWithProfile = OrganizationMember & {
  profiles: Profile | null
}

export class OrganizationMembersRepository extends BaseRepositoryImpl<"organization_members"> {
  constructor(client: SupabaseClientType) {
    super(client, "organization_members")
  }

  /**
   * Get all members of an organization with their profiles
   */
  async findByOrganizationId(organizationId: string): Promise<OrganizationMemberWithProfile[]> {
    // Fetch organization members
    const { data: membersData, error: membersError } = await this.client
      .from("organization_members")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })

    if (membersError) {
      throw new Error(`Failed to fetch organization members: ${membersError.message}`)
    }

    if (!membersData || membersData.length === 0) {
      return []
    }

    // Get all user IDs
    const userIds = membersData.map((member) => member.user_id)

    // Fetch profiles for these users
    const { data: profilesData, error: profilesError } = await this.client
      .from("profiles")
      .select("id, email, name, avatar_url")
      .in("id", userIds)

    if (profilesError) {
      // Don't throw - we can still show members without profile data
    }

    // Create a map of user_id -> profile
    const profilesMap = new Map(
      (profilesData || []).map((profile) => [profile.id, profile])
    )

    // Combine members with profiles
    return membersData.map((member) => ({
      ...member,
      profiles: profilesMap.get(member.user_id) || null,
    })) as OrganizationMemberWithProfile[]
  }

  /**
   * Update member role
   */
  async updateRole(memberId: string, role: "admin" | "member" | "viewer"): Promise<OrganizationMember> {
    return this.update(memberId, { role })
  }

  /**
   * Remove member from organization
   */
  async removeMember(memberId: string): Promise<void> {
    return this.delete(memberId)
  }
}

