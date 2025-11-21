/**
 * Centralized functions for getting color classes for statuses, roles, types, and plans.
 * Used for consistent display of Badge components throughout the application.
 */

/**
 * Get color class for user status
 */
export function getUserStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "inactive":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    case "suspended":
      return "bg-red-500/10 text-red-700 dark:text-red-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for integration status
 */
export function getIntegrationStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "inactive":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    case "error":
      return "bg-red-500/10 text-red-700 dark:text-red-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for subscription status
 */
export function getSubscriptionStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "canceled":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    case "past_due":
      return "bg-red-500/10 text-red-700 dark:text-red-400"
    case "trialing":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for report status
 */
export function getReportStatusColor(status: string): string {
  switch (status) {
    case "published":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "draft":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
    case "archived":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for user role
 */
export function getRoleColor(role: string): string {
  switch (role) {
    case "admin":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
    case "user":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    case "viewer":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for report type
 */
export function getReportTypeColor(type: string): string {
  switch (type) {
    case "sales":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    case "traffic":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
    case "revenue":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "custom":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for integration type
 */
export function getIntegrationTypeColor(type: string): string {
  switch (type) {
    case "stripe":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
    case "sendgrid":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    case "aws":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
    case "slack":
      return "bg-pink-500/10 text-pink-700 dark:text-pink-400"
    case "github":
      return "bg-gray-900/10 text-gray-900 dark:text-gray-100"
    case "custom":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for notification type
 */
export function getNotificationTypeColor(type: string): string {
  switch (type) {
    case "info":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    case "success":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "warning":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
    case "error":
      return "bg-red-500/10 text-red-700 dark:text-red-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Get color class for subscription plan
 */
export function getPlanColor(plan: string): string {
  switch (plan) {
    case "enterprise":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
    case "pro":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    case "free":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

/**
 * Universal function for getting status color (for backward compatibility)
 * Automatically determines status type
 */
export function getStatusColor(status: string, context?: "user" | "integration" | "subscription" | "report"): string {
  if (context) {
    switch (context) {
      case "user":
        return getUserStatusColor(status)
      case "integration":
        return getIntegrationStatusColor(status)
      case "subscription":
        return getSubscriptionStatusColor(status)
      case "report":
        return getReportStatusColor(status)
    }
  }

  // Automatic determination by status value
  const statusLower = status.toLowerCase()
  if (["active", "inactive", "suspended"].includes(statusLower)) {
    return getUserStatusColor(status)
  }
  if (["active", "inactive", "error"].includes(statusLower)) {
    return getIntegrationStatusColor(status)
  }
  if (["active", "canceled", "past_due", "trialing"].includes(statusLower)) {
    return getSubscriptionStatusColor(status)
  }
  if (["published", "draft", "archived"].includes(statusLower)) {
    return getReportStatusColor(status)
  }

  return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
}

/**
 * Universal function for getting type color
 */
export function getTypeColor(type: string, context?: "report" | "integration" | "notification"): string {
  if (context) {
    switch (context) {
      case "report":
        return getReportTypeColor(type)
      case "integration":
        return getIntegrationTypeColor(type)
      case "notification":
        return getNotificationTypeColor(type)
    }
  }

  // Attempt automatic determination
  const typeLower = type.toLowerCase()
  if (["sales", "traffic", "revenue", "custom"].includes(typeLower)) {
    return getReportTypeColor(type)
  }
  if (["stripe", "sendgrid", "aws", "slack", "github", "custom"].includes(typeLower)) {
    return getIntegrationTypeColor(type)
  }
  if (["info", "success", "warning", "error"].includes(typeLower)) {
    return getNotificationTypeColor(type)
  }

  return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
}

