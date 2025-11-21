/**
 * Utilities for formatting data (dates, currencies, numbers, etc.)
 */

import { format, formatDistanceToNow } from "date-fns"

/**
 * Format date in short format (MMM d, yyyy)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "MMM d, yyyy")
}

/**
 * Format date and time (MMM d, yyyy HH:mm)
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "MMM d, yyyy HH:mm")
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, options?: { addSuffix?: boolean }): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(dateObj, {
    addSuffix: options?.addSuffix ?? true,
    ...options,
  })
}

/**
 * Format currency (default USD)
 */
export function formatCurrency(amount: number, currency: string = "USD", locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format date range (start - end)
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const startObj = typeof start === "string" ? new Date(start) : start
  const endObj = typeof end === "string" ? new Date(end) : end
  
  const startFormatted = format(startObj, "MMM d")
  const endFormatted = format(endObj, "MMM d, yyyy")
  
  return `${startFormatted} - ${endFormatted}`
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text to specified length with "..." appended
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

