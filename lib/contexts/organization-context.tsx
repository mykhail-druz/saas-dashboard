"use client"

import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Organization = {
  id: string
  name: string
  slug: string
  created_by: string | null
  created_at: string
  updated_at: string
}

type OrganizationMember = {
  id: string
  organization_id: string
  user_id: string
  role: "owner" | "admin" | "member" | "viewer"
  invited_by: string | null
  joined_at: string
  created_at: string
}

type OrganizationContextType = {
  currentOrganization: Organization | null
  organizations: Organization[]
  memberRole: "owner" | "admin" | "member" | "viewer" | null
  isLoading: boolean
  switchOrganization: (organizationId: string) => Promise<void>
  refreshOrganizations: () => Promise<void>
  isOwner: boolean
  isAdmin: boolean
  canManageUsers: boolean
  canManageSettings: boolean
}

type OrganizationCache = {
  organizations: Organization[]
  currentOrganizationId: string | null
  memberRole: "owner" | "admin" | "member" | "viewer" | null
  cachedAt: number
}

const CACHE_KEY = "organization-cache"

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

// Synchronous function to load cache from localStorage (runs before first render)
function loadCachedOrganizationsSync(): OrganizationCache | null {
  if (typeof window === "undefined") return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const cache: OrganizationCache = JSON.parse(cached)
    
    // Validate cache structure
    if (!cache.organizations || !Array.isArray(cache.organizations)) {
      return null
    }

    return cache
  } catch (error) {
    return null
  }
}

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with lazy initialization - loads cache synchronously on client
  // On server, returns null/[]/true (same as client initial render before cache load)
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(() => {
    // Only access localStorage on client side
    if (typeof window === "undefined") return null
    const cached = loadCachedOrganizationsSync()
    if (cached && cached.organizations.length > 0) {
      const savedOrgId = cached.currentOrganizationId || localStorage.getItem("currentOrganizationId")
      return cached.organizations.find((org) => org.id === savedOrgId) || cached.organizations[0] || null
    }
    return null
  })

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    if (typeof window === "undefined") return []
    const cached = loadCachedOrganizationsSync()
    return cached && cached.organizations.length > 0 ? cached.organizations : []
  })

  const [memberRole, setMemberRole] = useState<"owner" | "admin" | "member" | "viewer" | null>(() => {
    if (typeof window === "undefined") return null
    const cached = loadCachedOrganizationsSync()
    return cached ? cached.memberRole : null
  })

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const cached = loadCachedOrganizationsSync()
    // If we have valid cache, no loading needed
    return !(cached && cached.organizations.length > 0)
  })

  const [isInitialized, setIsInitialized] = useState(false)
  const supabase = createClient()

  // Ensure cache is loaded and state is synced on mount
  useLayoutEffect(() => {
    if (isInitialized) return
    
    const cached = loadCachedOrganizationsSync()
    if (cached && cached.organizations.length > 0) {
      const savedOrgId = cached.currentOrganizationId || localStorage.getItem("currentOrganizationId")
      const selectedOrg = cached.organizations.find((org) => org.id === savedOrgId) || cached.organizations[0]
      
      if (selectedOrg) {
        // Only update if different to avoid unnecessary re-renders
        setCurrentOrganization((prev) => prev || selectedOrg)
        setOrganizations((prev) => prev.length > 0 ? prev : cached.organizations)
        setMemberRole((prev) => prev || cached.memberRole)
        setIsLoading(false)
      }
    } else if (!cached) {
      // No cache, ensure loading state is correct
      setIsLoading(true)
    }
    setIsInitialized(true)
  }, [isInitialized])

  // Load cached organizations from localStorage (async version for callbacks)
  const loadCachedOrganizations = useCallback((): OrganizationCache | null => {
    return loadCachedOrganizationsSync()
  }, [])

  // Save organizations to cache
  const cacheOrganizations = useCallback((
    orgs: Organization[],
    currentOrgId: string | null,
    role: "owner" | "admin" | "member" | "viewer" | null
  ) => {
    if (typeof window === "undefined") return

    try {
      const cache: OrganizationCache = {
        organizations: orgs,
        currentOrganizationId: currentOrgId,
        memberRole: role,
        cachedAt: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      
      // Also ensure currentOrganizationId is saved separately for backward compatibility
      if (currentOrgId) {
        localStorage.setItem("currentOrganizationId", currentOrgId)
      }
    } catch (error) {
      // Error caching organizations - silently fail
      console.error("Failed to cache organizations:", error)
    }
  }, [])

  const fetchOrganizations = useCallback(async (forceRefresh = false) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      // Fetch fresh data from server (cache is already loaded in useLayoutEffect)
      const { data: membersData, error: membersError } = await supabase
        .from("organization_members")
        .select(
          `
          *,
          organizations (
            id,
            name,
            slug,
            created_by,
            created_at,
            updated_at
          )
        `
        )
        .eq("user_id", user.id)

      if (membersError) {
        // If we have cached data, keep it. Only show error if no cache
        if (!loadCachedOrganizations()) {
          toast.error("Failed to load organizations")
          setIsLoading(false)
        }
        return
      }

      const orgs = (membersData || [])
        .filter((member: any) => member.organizations)
        .map((member: any) => ({
          ...member.organizations,
          memberRole: member.role,
        })) as (Organization & { memberRole: string })[]

      const organizationsList = orgs.map(({ memberRole, ...org }) => org)
      setOrganizations(organizationsList)

      // Get current organization from localStorage or use first one
      const savedOrgId = localStorage.getItem("currentOrganizationId")
      let selectedOrg = orgs.find((org) => org.id === savedOrgId) || orgs[0]

      if (selectedOrg) {
        const role = selectedOrg.memberRole as "owner" | "admin" | "member" | "viewer"
        
        // Update state
        setCurrentOrganization(selectedOrg)
        setMemberRole(role)
        localStorage.setItem("currentOrganizationId", selectedOrg.id)
        
        // IMPORTANT: Update cache with fresh data immediately
        // This ensures cache is available for next page load
        cacheOrganizations(organizationsList, selectedOrg.id, role)
      } else {
        // If no organization found, reset memberRole
        setMemberRole(null)
        setCurrentOrganization(null)
        localStorage.removeItem("currentOrganizationId")
        cacheOrganizations([], null, null)
      }
    } catch (error) {
      // If we have cached data, keep it. Only show error if no cache
      if (!loadCachedOrganizations()) {
        toast.error("Failed to load organizations")
      }
    } finally {
      setIsLoading(false)
    }
  }, [supabase, loadCachedOrganizations, cacheOrganizations])

  const switchOrganization = useCallback(
    async (organizationId: string) => {
      const org = organizations.find((o) => o.id === organizationId)
      if (!org) {
        toast.error("Organization not found")
        return
      }

      // Get member role for this organization
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: memberData } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .single()

      if (memberData) {
        const role = memberData.role as "owner" | "admin" | "member" | "viewer"
        setCurrentOrganization(org)
        setMemberRole(role)
        localStorage.setItem("currentOrganizationId", organizationId)
        
        // Update cache with new selection
        cacheOrganizations(organizations, organizationId, role)
        
        toast.success(`Switched to ${org.name}`)
      }
    },
    [organizations, supabase, cacheOrganizations]
  )

  const refreshOrganizations = useCallback(async () => {
    setIsLoading(true)
    // Force refresh - skip cache and fetch fresh data
    await fetchOrganizations(true)
  }, [fetchOrganizations])

  useEffect(() => {
    // Only fetch if we've initialized from cache (or if no cache exists)
    if (isInitialized) {
      // Fetch fresh data in background
      fetchOrganizations()
    }
  }, [fetchOrganizations, isInitialized])

  const isOwner = memberRole === "owner"
  const isAdmin = memberRole === "admin" || isOwner
  const canManageUsers = isAdmin
  const canManageSettings = isOwner

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        memberRole,
        isLoading,
        switchOrganization,
        refreshOrganizations,
        isOwner,
        isAdmin,
        canManageUsers,
        canManageSettings,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}

