import { eq } from "drizzle-orm"

import { users } from "@/drizzle/schema"
import { db } from "@/lib/db"

type User = typeof users.$inferSelect

/**
 * Handles all data-access operations for the `users` table.
 * No business logic lives here — only raw DB queries.
 */
export class UserRepository {
  /**
   * Finds a user by their email address (case-insensitive).
   * Returns `null` if no matching record exists.
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.trim().toLowerCase()),
    })

    return user ?? null
  }

  /**
   * Finds a user by their primary key.
   * Returns `null` if no matching record exists.
   */
  async findById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    return user ?? null
  }

  /**
   * Persists a new user record to the database.
   */
  async create(data: typeof users.$inferInsert): Promise<User> {
    const [inserted] = await db.insert(users).values(data).returning()
    return inserted
  }
}
