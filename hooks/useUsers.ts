/**
 * React hook for working with users
 */

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { UsersService } from "@/lib/services/users.service"
import { Database } from "@/types/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        setError(null)
        const client = createClient()
        const service = new UsersService(client)
        const data = await service.getAllUsers()
        setUsers(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch users"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const refetch = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const client = createClient()
      const service = new UsersService(client)
      const data = await service.getAllUsers()
      setUsers(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch users"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { users, isLoading, error, refetch }
}

