/**
 * Service for working with integrations (business logic)
 */

import { IntegrationsRepository } from "@/lib/repositories/integrations.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"
import { Database } from "@/types/database.types"

type Integration = Database["public"]["Tables"]["integrations"]["Row"]
type IntegrationInsert = Database["public"]["Tables"]["integrations"]["Insert"]
type IntegrationUpdate = Database["public"]["Tables"]["integrations"]["Update"]

export class IntegrationsService {
  private repository: IntegrationsRepository

  constructor(client: SupabaseClientType) {
    this.repository = new IntegrationsRepository(client)
  }

  async getAllIntegrations(): Promise<Integration[]> {
    return this.repository.findAll(undefined, { column: "created_at", ascending: false })
  }

  async getIntegrationById(id: string): Promise<Integration | null> {
    return this.repository.findById(id)
  }

  async createIntegration(data: IntegrationInsert): Promise<Integration> {
    return this.repository.create(data)
  }

  async updateIntegration(id: string, data: IntegrationUpdate): Promise<Integration> {
    return this.repository.update(id, {
      ...data,
      updated_at: new Date().toISOString(),
    })
  }

  async deleteIntegration(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  async getIntegrationsByStatus(status: string): Promise<Integration[]> {
    return this.repository.findByStatus(status)
  }

  async getIntegrationsByType(type: string): Promise<Integration[]> {
    return this.repository.findByType(type)
  }

  async updateLastSync(id: string): Promise<Integration> {
    return this.repository.updateLastSync(id)
  }
}

