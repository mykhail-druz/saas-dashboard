/**
 * Service for working with reports (business logic)
 */

import { ReportsRepository } from "@/lib/repositories/reports.repository"
import { SupabaseClientType } from "@/lib/repositories/base.repository"
import { Database } from "@/types/database.types"

type Report = Database["public"]["Tables"]["reports"]["Row"]
type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"]
type ReportUpdate = Database["public"]["Tables"]["reports"]["Update"]

export interface ReportFilters {
  status?: string
  type?: string
}

export class ReportsService {
  private repository: ReportsRepository

  constructor(client: SupabaseClientType) {
    this.repository = new ReportsRepository(client)
  }

  async getAllReports(filters?: ReportFilters): Promise<Report[]> {
    if (filters && (filters.status || filters.type)) {
      return this.repository.findByFilters(filters)
    }
    return this.repository.findAll(undefined, { column: "created_at", ascending: false })
  }

  async getReportById(id: string): Promise<Report | null> {
    return this.repository.findById(id)
  }

  async createReport(data: ReportInsert): Promise<Report> {
    return this.repository.create(data)
  }

  async updateReport(id: string, data: ReportUpdate): Promise<Report> {
    return this.repository.update(id, {
      ...data,
      updated_at: new Date().toISOString(),
    })
  }

  async deleteReport(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  async getReportsByStatus(status: string): Promise<Report[]> {
    return this.repository.findByStatus(status)
  }

  async getReportsByType(type: string): Promise<Report[]> {
    return this.repository.findByType(type)
  }

  async getReportsByCreator(userId: string): Promise<Report[]> {
    return this.repository.findByCreator(userId)
  }

  async getReportCount(): Promise<number> {
    return this.repository.count()
  }
}

