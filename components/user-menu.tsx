"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { getCachedAvatarUrl, cacheAvatarUrl, clearCachedAvatarUrl } from "@/lib/utils/storage"

type Profile = Database["public"]["Tables"]["profiles"]["Row"] | null

interface UserMenuProps {
  user: User
  profile: Profile
}

// Cache key for user profile name
const PROFILE_NAME_CACHE_KEY = "user_profile_name"
const PROFILE_NAME_CACHE_TIMESTAMP_KEY = "user_profile_name_timestamp"

function getCachedProfileName(userId: string): string | null {
  if (typeof window === "undefined") return null
  
  try {
    const cached = localStorage.getItem(`${PROFILE_NAME_CACHE_KEY}_${userId}`)
    const timestamp = localStorage.getItem(`${PROFILE_NAME_CACHE_TIMESTAMP_KEY}_${userId}`)
    
    if (cached && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp, 10)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
      
      if (cacheAge < maxAge) {
        return cached
      } else {
        localStorage.removeItem(`${PROFILE_NAME_CACHE_KEY}_${userId}`)
        localStorage.removeItem(`${PROFILE_NAME_CACHE_TIMESTAMP_KEY}_${userId}`)
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return null
}

function cacheProfileName(name: string | null, userId: string): void {
  if (typeof window === "undefined") return
  
  try {
    const key = `${PROFILE_NAME_CACHE_KEY}_${userId}`
    const timestampKey = `${PROFILE_NAME_CACHE_TIMESTAMP_KEY}_${userId}`
    
    if (name) {
      localStorage.setItem(key, name)
      localStorage.setItem(timestampKey, Date.now().toString())
    } else {
      localStorage.removeItem(key)
      localStorage.removeItem(timestampKey)
    }
  } catch (error) {
    // Ignore errors
  }
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  // Initialize with same values on server and client to avoid hydration mismatch
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)
  const [cachedName, setCachedName] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Ensure component is mounted on client to avoid hydration mismatch with Radix UI IDs
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load cache synchronously on client before first paint to avoid flicker
  useLayoutEffect(() => {
    if (isInitialized) return
    
    // Load cached avatar
    const cachedAvatar = getCachedAvatarUrl(user.id)
    if (cachedAvatar) {
      setAvatarUrl(cachedAvatar)
    }
    
    // Load cached name
    const cachedProfileName = getCachedProfileName(user.id)
    if (cachedProfileName) {
      setCachedName(cachedProfileName)
    }
    
    setIsInitialized(true)
  }, [user.id, isInitialized])

  // Update from profile data (which might be newer than cache)
  useEffect(() => {
    if (!isInitialized) return
    
    // Update avatar from profile
    if (profile?.avatar_url) {
      // Only update if different from current to avoid unnecessary re-renders
      if (profile.avatar_url !== avatarUrl) {
        setAvatarUrl(profile.avatar_url)
        cacheAvatarUrl(profile.avatar_url, user.id)
        // Preload the new image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = profile.avatar_url
      }
    } else if (avatarUrl && !profile?.avatar_url) {
      // Profile has no avatar but cache does, clear it
      setAvatarUrl(null)
      cacheAvatarUrl(null, user.id)
    }
    
    // Update name from profile
    if (profile?.name) {
      if (profile.name !== cachedName) {
        setCachedName(profile.name)
        cacheProfileName(profile.name, user.id)
      }
    }
  }, [profile?.avatar_url, profile?.name, user.id, avatarUrl, cachedName, isInitialized])

  async function handleSignOut() {
    setIsLoading(true)
    try {
      // Clear cached avatar on sign out
      clearCachedAvatarUrl(user.id)
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error("Failed to sign out", {
          description: error.message,
        })
        return
      }
      toast.success("Signed out successfully")
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Use cached name if available, fallback to profile name, then email
  const displayName = cachedName || profile?.name || null
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() || "U"

  // Render placeholder during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <Button 
        variant="ghost" 
        className="relative h-10 w-10 rounded-full"
        disabled
      >
        <Avatar className="h-10 w-10">
          {avatarUrl && (
            <AvatarImage 
              src={avatarUrl} 
              alt={displayName || "User"}
              className="object-cover"
            />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            {avatarUrl && (
              <AvatarImage 
                src={avatarUrl} 
                alt={displayName || "User"}
                className="object-cover"
                onError={() => {
                  // If image fails to load, clear cache and fallback to initials
                  setAvatarUrl(null)
                  clearCachedAvatarUrl(user.id)
                }}
              />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/settings" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

