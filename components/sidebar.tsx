"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/lib/contexts/organization-context";
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Puzzle,
  CreditCard,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const allNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "admin", "member", "viewer"],
  },
  { href: "/users", label: "Users", icon: Users, roles: ["owner", "admin"] },
  {
    href: "/reports",
    label: "Reports",
    icon: FileText,
    roles: ["owner", "admin", "member", "viewer"],
  },
  {
    href: "/activity",
    label: "Activity",
    icon: Activity,
    roles: ["owner", "admin", "member", "viewer"],
  },
  {
    href: "/integrations",
    label: "Integrations",
    icon: Puzzle,
    roles: ["owner", "admin"],
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CreditCard,
    roles: ["owner", "admin", "member"],
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["owner", "admin", "member", "viewer"],
  },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["owner"] },
];

export function Sidebar() {
  const pathname = usePathname();
  // Initialize state from localStorage using lazy initialization
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    return false;
  });
  const { memberRole, isLoading } = useOrganization();

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Filter nav items based on user role
  // If memberRole is null (still loading or error), show all items to avoid hiding functionality
  // Once role is loaded, filter based on actual role
  const navItems = allNavItems.filter((item) => {
    if (!memberRole) {
      // If role is not loaded yet, show all items
      // This ensures users don't lose access if there's a loading issue
      return true;
    }
    return item.roles.includes(memberRole);
  });

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image
              src="/android-chrome-192x192.png"
              alt="Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <h1 className="text-xl font-bold">Analytics Pro</h1>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/favicon-32x32.png"
              alt="Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {/* Show loading only if we have no data at all (no cache and no role) */}
        {isLoading && navItems.length === 0 && memberRole === null && (
          <div className="text-sm text-muted-foreground px-3 py-2">
            Loading...
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
