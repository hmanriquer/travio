import { eq, sql } from "drizzle-orm"

import { travelRequests } from "@/drizzle/schema"
import { db } from "@/lib/db"
import type {
  DashboardSummary,
  PendingTaskItem,
  RecentActivityItem,
} from "@/lib/types/dashboard.types"
import type { TravelRow } from "@/lib/types/travels.types"

type TravelRequest = typeof travelRequests.$inferSelect
type NewTravelRequest = typeof travelRequests.$inferInsert

/**
 * Handles all data-access operations for the `travel_requests` table.
 * No business logic lives here — only raw DB queries.
 */
export class TravelRequestRepository {
  /**
   * Finds a single travel request by its primary key, joined with traveler info.
   * Returns `null` if no matching record exists.
   */
  async findByIdWithTraveler(id: string) {
    const request = await db.query.travelRequests.findFirst({
      where: eq(travelRequests.id, id),
      with: { traveler: true },
    })

    return request ?? null
  }

  /**
   * Returns every travel request, most recently created first.
   */
  async findAll(): Promise<TravelRequest[]> {
    const rows = await db.query.travelRequests.findMany({
      orderBy: (tr, { desc }) => [desc(tr.createdAt)],
    })

    return rows
  }

  /**
   * Finds a single travel request by its primary key.
   * Returns `null` if no matching record exists.
   */
  async findById(id: string): Promise<TravelRequest | null> {
    const request = await db.query.travelRequests.findFirst({
      where: eq(travelRequests.id, id),
    })

    return request ?? null
  }

  /**
   * Returns all travel requests belonging to a specific traveler.
   */
  async findByTravelerId(travelerId: string): Promise<TravelRequest[]> {
    const rows = await db.query.travelRequests.findMany({
      where: eq(travelRequests.travelerId, travelerId),
      orderBy: (tr, { desc }) => [desc(tr.createdAt)],
    })

    return rows
  }

  /**
   * Inserts a new travel request and returns the created record.
   */
  async create(data: NewTravelRequest): Promise<TravelRequest> {
    const [created] = await db.insert(travelRequests).values(data).returning()

    return created
  }

  /**
   * Applies a partial update to a travel request by ID.
   * Returns the updated record, or `null` if it did not exist.
   */
  async update(
    id: string,
    data: Partial<Omit<NewTravelRequest, "id" | "createdAt">>
  ): Promise<TravelRequest | null> {
    const [updated] = await db
      .update(travelRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(travelRequests.id, id))
      .returning()

    return updated ?? null
  }

  /**
   * Deletes a travel request by ID.
   * Returns `true` when a row was removed, `false` if no row matched.
   */
  async delete(id: string): Promise<boolean> {
    const [deleted] = await db
      .delete(travelRequests)
      .where(eq(travelRequests.id, id))
      .returning({ id: travelRequests.id })

    return !!deleted
  }

  /**
   * Returns aggregated financial totals and status counts for the dashboard.
   * Uses a single query with conditional aggregation for efficiency.
   */
  async findDashboardSummary(): Promise<DashboardSummary> {
    const [totals] = await db
      .select({
        totalDeposited: sql<string>`coalesce(sum(${travelRequests.depositAmount}), '0')`,
        totalProven: sql<string>`coalesce(sum(${travelRequests.provenAmount}), '0')`,
        activeCount: sql<string>`count(*) filter (where ${travelRequests.status} not in ('COMPLETED', 'REJECTED'))`,
        pendingCount: sql<string>`count(*) filter (where ${travelRequests.status} = 'PENDING')`,
        completedCount: sql<string>`count(*) filter (where ${travelRequests.status} = 'COMPLETED')`,
      })
      .from(travelRequests)

    const totalDeposited = parseFloat(totals.totalDeposited)
    const totalProven = parseFloat(totals.totalProven)

    return {
      totalDeposited,
      totalProven,
      netBalance: totalDeposited - totalProven,
      activeCount: parseInt(totals.activeCount, 10),
      pendingCount: parseInt(totals.pendingCount, 10),
      completedCount: parseInt(totals.completedCount, 10),
    }
  }

  /**
   * Returns the most recent travel requests joined with their traveler name.
   * Used to populate the recent activity feed on the dashboard.
   */
  async findRecentWithTraveler(limit = 5): Promise<RecentActivityItem[]> {
    const rows = await db.query.travelRequests.findMany({
      with: { traveler: true },
      orderBy: (tr, { desc }) => [desc(tr.createdAt)],
      limit,
    })

    return rows.map((row) => ({
      id: row.id,
      travelerName: row.traveler.name,
      destinationRegion: row.destinationRegion,
      depositAmount: row.depositAmount,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    }))
  }

  /**
   * Returns all PENDING travel requests joined with their traveler name.
   * Used to populate the pending tasks panel on the dashboard.
   */
  async findPendingWithTraveler(): Promise<PendingTaskItem[]> {
    const rows = await db.query.travelRequests.findMany({
      with: { traveler: true },
      where: (tr, { eq: eqFn }) => eqFn(tr.status, "PENDING"),
      orderBy: (tr, { asc }) => [asc(tr.createdAt)],
    })

    return rows.map((row) => ({
      id: row.id,
      travelerName: row.traveler.name,
      travelReason: row.travelReason,
      destinationRegion: row.destinationRegion,
      startDate: row.startDate,
      proofDeadline: row.proofDeadline,
      priority: computeTaskPriority(row.startDate),
    }))
  }

  /**
   * Returns all travel requests joined with their traveler name and department.
   * Used to populate the travels table.
   */
  async findAllWithTraveler(): Promise<TravelRow[]> {
    const rows = await db.query.travelRequests.findMany({
      with: { traveler: true },
      orderBy: (tr, { desc }) => [desc(tr.createdAt)],
    })

    return rows.map((row) => ({
      id: row.id,
      travelerName: row.traveler.name,
      travelerDepartment: row.traveler.department,
      destinationRegion: row.destinationRegion,
      travelReason: row.travelReason,
      startDate: row.startDate,
      endDate: row.endDate,
      days: row.days,
      status: row.status,
      depositAmount: row.depositAmount,
      provenAmount: row.provenAmount,
    }))
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Derives a display priority for a pending task based on how soon the trip starts.
 * - Past or within 7 days  → "alta"
 * - Within 30 days         → "media"
 * - Further out            → "baja"
 */
function computeTaskPriority(startDate: string): PendingTaskItem["priority"] {
  const start = new Date(`${startDate}T00:00:00`)
  const today = new Date()
  const daysUntilStart = Math.ceil(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilStart <= 7) return "alta"
  if (daysUntilStart <= 30) return "media"
  return "baja"
}
