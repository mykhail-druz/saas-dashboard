import { createClient } from "@/lib/supabase/client"

const AVATAR_CACHE_KEY = "user_avatar_url"
const AVATAR_CACHE_TIMESTAMP_KEY = "user_avatar_timestamp"

/**
 * Get public URL for an avatar from Supabase Storage
 */
export function getAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null
  
  const supabase = createClient()
  const { data } = supabase.storage.from("avatars").getPublicUrl(path)
  return data.publicUrl
}

/**
 * Cache avatar URL in localStorage
 */
export function cacheAvatarUrl(url: string | null, userId?: string): void {
  if (typeof window === "undefined") return
  
  const key = userId ? `${AVATAR_CACHE_KEY}_${userId}` : AVATAR_CACHE_KEY
  const timestampKey = userId ? `${AVATAR_CACHE_TIMESTAMP_KEY}_${userId}` : AVATAR_CACHE_TIMESTAMP_KEY
  
  if (url) {
    localStorage.setItem(key, url)
    localStorage.setItem(timestampKey, Date.now().toString())
  } else {
    localStorage.removeItem(key)
    localStorage.removeItem(timestampKey)
  }
}

/**
 * Get cached avatar URL from localStorage
 */
export function getCachedAvatarUrl(userId?: string): string | null {
  if (typeof window === "undefined") return null
  
  const key = userId ? `${AVATAR_CACHE_KEY}_${userId}` : AVATAR_CACHE_KEY
  const timestampKey = userId ? `${AVATAR_CACHE_TIMESTAMP_KEY}_${userId}` : AVATAR_CACHE_TIMESTAMP_KEY
  
  const cachedUrl = localStorage.getItem(key)
  const timestamp = localStorage.getItem(timestampKey)
  
  // Cache is valid for 7 days
  if (cachedUrl && timestamp) {
    const cacheAge = Date.now() - parseInt(timestamp, 10)
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    
    if (cacheAge < maxAge) {
      return cachedUrl
    } else {
      // Cache expired, remove it
      localStorage.removeItem(key)
      localStorage.removeItem(timestampKey)
    }
  }
  
  return null
}

/**
 * Clear cached avatar URL
 */
export function clearCachedAvatarUrl(userId?: string): void {
  if (typeof window === "undefined") return
  
  const key = userId ? `${AVATAR_CACHE_KEY}_${userId}` : AVATAR_CACHE_KEY
  const timestampKey = userId ? `${AVATAR_CACHE_TIMESTAMP_KEY}_${userId}` : AVATAR_CACHE_TIMESTAMP_KEY
  
  localStorage.removeItem(key)
  localStorage.removeItem(timestampKey)
}

/**
 * Delete an avatar from Supabase Storage
 */
export async function deleteAvatar(path: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase.storage.from("avatars").remove([path])
    
    if (error) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

/**
 * Extract path from full avatar URL
 * If the URL is from Supabase Storage, extract the path
 * Otherwise return null
 */
export function extractAvatarPath(url: string | null | undefined): string | null {
  if (!url) return null
  
  // Check if it's a Supabase Storage URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !url.includes(supabaseUrl)) {
    return null
  }
  
  // Extract path from URL like: https://xxx.supabase.co/storage/v1/object/public/avatars/{path}
  const match = url.match(/\/avatars\/(.+)$/)
  return match ? match[1] : null
}

