/**
 * React hook for working with integrations
 */

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { IntegrationsService } from "@/lib/services/integrations.service"
import { Database } from "@/types/database.types"

type Integration = Database["public"]["Tables"]["integrations"]["Row"]

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const client = createClient()
      const service = new IntegrationsService(client)
      const data = await service.getAllIntegrations()
      setIntegrations(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch integrations"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const createIntegration = async (data: Database["public"]["Tables"]["integrations"]["Insert"]) => {
    try {
      const client = createClient()
      const service = new IntegrationsService(client)
      const created = await service.createIntegration(data)
      setIntegrations((prev) => [created, ...prev])
      return created
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create integration"
      setError(message)
      throw err
    }
  }

  const updateIntegration = async (id: string, data: Database["public"]["Tables"]["integrations"]["Update"]) => {
    try {
      const client = createClient()
      const service = new IntegrationsService(client)
      const updated = await service.updateIntegration(id, data)
      setIntegrations((prev) => prev.map((i) => (i.id === id ? updated : i)))
      return updated
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update integration"
      setError(message)
      throw err
    }
  }

  const deleteIntegration = async (id: string) => {
    try {
      const client = createClient()
      const service = new IntegrationsService(client)
      await service.deleteIntegration(id)
      setIntegrations((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete integration"
      setError(message)
      throw err
    }
  }

  return {
    integrations,
    isLoading,
    error,
    refetch: fetchIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
  }
}

