/**
 * Service for working with organization members (business logic)
 */

import { OrganizationMembersRepository, OrganizationMemberWithProfile } from "@/lib/repositories/organization-members.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"

export class OrganizationMembersService {
  private repository: OrganizationMembersRepository

  constructor(client: SupabaseClientType) {
    this.repository = new OrganizationMembersRepository(client)
  }

  /**
   * Get all members of an organization with their profiles
   */
  async getOrganizationMembers(organizationId: string): Promise<OrganizationMemberWithProfile[]> {
    if (!organizationId) {
      throw new Error("Organization ID is required")
    }
    return this.repository.findByOrganizationId(organizationId)
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    memberId: string,
    newRole: "admin" | "member" | "viewer"
  ): Promise<void> {
    if (!memberId) {
      throw new Error("Member ID is required")
    }
    if (!newRole) {
      throw new Error("Role is required")
    }
    await this.repository.updateRole(memberId, newRole)
  }

  /**
   * Remove member from organization
   */
  async removeMember(memberId: string): Promise<void> {
    if (!memberId) {
      throw new Error("Member ID is required")
    }
    await this.repository.removeMember(memberId)
  }
}

