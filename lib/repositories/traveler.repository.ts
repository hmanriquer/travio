import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { travelers } from "@/drizzle/schema"

type Traveler = typeof travelers.$inferSelect
type NewTraveler = typeof travelers.$inferInsert

/**
 * Handles all data-access operations for the `travelers` table.
 * No business logic lives here — only raw DB queries.
 */
export class TravelerRepository {
  /**
   * Returns every traveler record ordered by name.
   */
  async findAll(): Promise<Traveler[]> {
    const rows = await db.query.travelers.findMany({
      orderBy: (t, { asc }) => [asc(t.name)],
    })

    return rows
  }

  /**
   * Finds a single traveler by their primary key.
   * Returns `null` if no matching record exists.
   */
  async findById(id: string): Promise<Traveler | null> {
    const traveler = await db.query.travelers.findFirst({
      where: eq(travelers.id, id),
    })

    return traveler ?? null
  }

  /**
   * Inserts a new traveler and returns the created record.
   */
  async create(data: NewTraveler): Promise<Traveler> {
    const [created] = await db.insert(travelers).values(data).returning()
    return created
  }

  /**
   * Applies a partial update to a traveler by ID.
   * Returns the updated record, or `null` if it did not exist.
   */
  async update(
    id: string,
    data: Partial<Omit<NewTraveler, "id" | "createdAt">>,
  ): Promise<Traveler | null> {
    const [updated] = await db
      .update(travelers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(travelers.id, id))
      .returning()

    return updated ?? null
  }

  /**
   * Deletes a traveler by ID.
   * Returns `true` when a row was removed, `false` if no row matched.
   */
  async delete(id: string): Promise<boolean> {
    const [deleted] = await db
      .delete(travelers)
      .where(eq(travelers.id, id))
      .returning({ id: travelers.id })

    return !!deleted
  }
}
