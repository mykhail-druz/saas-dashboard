/**
 * Repository for working with integrations
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type Integration = Database["public"]["Tables"]["integrations"]["Row"]

export class IntegrationsRepository extends BaseRepositoryImpl<"integrations"> {
  constructor(client: SupabaseClientType) {
    super(client, "integrations")
  }

  async findByStatus(status: string): Promise<Integration[]> {
    return this.findAll({ status }, { column: "created_at", ascending: false })
  }

  async findByType(type: string): Promise<Integration[]> {
    return this.findAll({ type }, { column: "created_at", ascending: false })
  }

  async updateLastSync(id: string): Promise<Integration> {
    return this.update(id, {
      last_sync_at: new Date().toISOString(),
    } as Database["public"]["Tables"]["integrations"]["Update"])
  }
}

