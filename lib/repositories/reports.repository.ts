/**
 * Repository for working with reports
 */

import { BaseRepositoryImpl, SupabaseClientType } from "./base.repository"
import { Database } from "@/types/database.types"

type Report = Database["public"]["Tables"]["reports"]["Row"]

export class ReportsRepository extends BaseRepositoryImpl<"reports"> {
  constructor(client: SupabaseClientType) {
    super(client, "reports")
  }

  async findByStatus(status: string): Promise<Report[]> {
    return this.findAll({ status }, { column: "created_at", ascending: false })
  }

  async findByType(type: string): Promise<Report[]> {
    return this.findAll({ type }, { column: "created_at", ascending: false })
  }

  async findByCreator(userId: string): Promise<Report[]> {
    return this.findAll({ created_by: userId }, { column: "created_at", ascending: false })
  }

  async findByFilters(filters: { status?: string; type?: string }): Promise<Report[]> {
    const queryFilters: Record<string, unknown> = {}
    
    if (filters.status) {
      queryFilters.status = filters.status
    }
    
    if (filters.type) {
      queryFilters.type = filters.type
    }

    return this.findAll(queryFilters, { column: "created_at", ascending: false })
  }
}

