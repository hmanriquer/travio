import type { travelRequests } from "@/drizzle/schema"

// ── Primitives ─────────────────────────────────────────────────────────────────

export type TravelRequestStatus = (typeof travelRequests.$inferSelect)["status"]

export type TaskPriority = "alta" | "media" | "baja"

// ── Dashboard Summary ──────────────────────────────────────────────────────────

/**
 * Aggregated financial and operational totals for the dashboard header cards.
 */
export type DashboardSummary = {
  totalDeposited: number
  totalProven: number
  netBalance: number
  activeCount: number
  pendingCount: number
  completedCount: number
}

// ── Recent Activity ────────────────────────────────────────────────────────────

/**
 * A single row in the recent activity feed.
 * Joins travelRequests with the associated traveler name.
 */
export type RecentActivityItem = {
  id: string
  travelerName: string
  destinationRegion: string
  depositAmount: string | null
  status: TravelRequestStatus
  createdAt: string
}

// ── Pending Tasks ──────────────────────────────────────────────────────────────

/**
 * A single task that requires attention.
 * Priority is computed from the proximity of the travel start date.
 */
export type PendingTaskItem = {
  id: string
  travelerName: string
  travelReason: string
  destinationRegion: string
  startDate: string
  proofDeadline: string | null
  priority: TaskPriority
}
