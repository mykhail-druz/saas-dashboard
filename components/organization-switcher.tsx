"use client"

import { useState, useEffect } from "react"
import { useOrganization } from "@/lib/contexts/organization-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Loader2 } from "lucide-react"

// Synchronous cache loader for optimistic UI
function getCachedOrganizationName(): string | null {
  if (typeof window === "undefined") return null
  
  try {
    const cached = localStorage.getItem("organization-cache")
    if (!cached) return null
    
    const cache = JSON.parse(cached)
    if (!cache?.organizations || !Array.isArray(cache.organizations) || cache.organizations.length === 0) {
      return null
    }
    
    const savedOrgId = cache.currentOrganizationId || localStorage.getItem("currentOrganizationId")
    const selectedOrg = cache.organizations.find((org: any) => org.id === savedOrgId) || cache.organizations[0]
    return selectedOrg?.name || null
  } catch (error) {
    return null
  }
}

export function OrganizationSwitcher() {
  const {
    currentOrganization,
    organizations,
    isLoading,
    switchOrganization,
  } = useOrganization()

  // Track if component is mounted on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [cachedName, setCachedName] = useState<string | null>(null)

  // Load cached name after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    const cached = getCachedOrganizationName()
    if (cached) {
      setCachedName(cached)
    }
  }, [])

  // On server, always render loading state to match initial client render
  // After mount, use cached name or currentOrganization
  if (!mounted) {
    // Server-side render: always show loading to match initial client state
    return (
      <div className="flex items-center gap-2 px-3 py-2" suppressHydrationWarning>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  // Use cached name if currentOrganization is not yet loaded (optimistic UI)
  const displayOrganization = currentOrganization || (mounted && cachedName ? { name: cachedName } : null)

  // Show loading only if we have no data at all (no cache and no current org)
  if (!displayOrganization && organizations.length === 0) {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 px-3 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )
    }
    return null
  }

  // If we have organization data (from context or cache), show it immediately
  if (!displayOrganization) {
    return null
  }

  // Use actual currentOrganization if available, otherwise use cached name
  const orgToDisplay = currentOrganization || (mounted && cachedName ? { name: cachedName, id: "" } : null)
  
  if (!orgToDisplay) {
    return null
  }

  if (organizations.length === 1 || (organizations.length === 0 && mounted && cachedName)) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{orgToDisplay.name}</span>
      </div>
    )
  }

  // Only show select if we have multiple organizations and currentOrganization is loaded
  if (!currentOrganization) {
    // Fallback: show cached name if available
    if (mounted && cachedName) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{cachedName}</span>
        </div>
      )
    }
    return null
  }

  return (
    <Select
      value={currentOrganization.id}
      onValueChange={switchOrganization}
    >
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <SelectValue>
            {currentOrganization.name}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

