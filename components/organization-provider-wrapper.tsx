"use client"

import { OrganizationProvider } from "@/lib/contexts/organization-context"

export function OrganizationProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <OrganizationProvider>{children}</OrganizationProvider>
}

