import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { travelRequests } from "@/drizzle/schema"

type TravelRequest = typeof travelRequests.$inferSelect
type NewTravelRequest = typeof travelRequests.$inferInsert

/**
 * Handles all data-access operations for the `travel_requests` table.
 * No business logic lives here — only raw DB queries.
 */
export class TravelRequestRepository {
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
    const [created] = await db
      .insert(travelRequests)
      .values(data)
      .returning()

    return created
  }

  /**
   * Applies a partial update to a travel request by ID.
   * Returns the updated record, or `null` if it did not exist.
   */
  async update(
    id: string,
    data: Partial<Omit<NewTravelRequest, "id" | "createdAt">>,
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
}
