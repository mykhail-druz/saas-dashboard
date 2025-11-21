"use client"

import { OrganizationProvider } from "@/lib/contexts/OrganizationContext"

export function OrganizationProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <OrganizationProvider>{children}</OrganizationProvider>
}

