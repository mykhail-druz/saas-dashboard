/**
 * React hook for working with reports
 */

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ReportsService, ReportFilters } from "@/lib/services/reports.service"
import { Database } from "@/types/database.types"

type Report = Database["public"]["Tables"]["reports"]["Row"]

export interface UseReportsOptions {
  filters?: ReportFilters
  autoFetch?: boolean
}

export function useReports(options: UseReportsOptions = {}) {
  const { filters, autoFetch = true } = options
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const client = createClient()
      const service = new ReportsService(client)
      const data = await service.getAllReports(filters)
      setReports(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch reports"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchReports()
    }
  }, [filters?.status, filters?.type, autoFetch])

  const createReport = async (data: Database["public"]["Tables"]["reports"]["Insert"]) => {
    try {
      const client = createClient()
      const service = new ReportsService(client)
      const created = await service.createReport(data)
      setReports((prev) => [created, ...prev])
      return created
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create report"
      setError(message)
      throw err
    }
  }

  const updateReport = async (id: string, data: Database["public"]["Tables"]["reports"]["Update"]) => {
    try {
      const client = createClient()
      const service = new ReportsService(client)
      const updated = await service.updateReport(id, data)
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)))
      return updated
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update report"
      setError(message)
      throw err
    }
  }

  const deleteReport = async (id: string) => {
    try {
      const client = createClient()
      const service = new ReportsService(client)
      await service.deleteReport(id)
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete report"
      setError(message)
      throw err
    }
  }

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
    createReport,
    updateReport,
    deleteReport,
  }
}

