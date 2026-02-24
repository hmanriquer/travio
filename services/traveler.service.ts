import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { travelers } from '@/db/schema';
import type {
  NewTraveler,
  Traveler,
  UpdateTraveler,
} from '@/schemas/traveler.schema';

export class TravelerService {
  constructor() {}

  static async createTraveler(traveler: NewTraveler): Promise<Traveler> {
    const [newTraveler] = await db
      .insert(travelers)
      .values(traveler)
      .returning();
    return newTraveler;
  }

  static async getTravelerById(id: number): Promise<Traveler | null> {
    const [traveler] = await db
      .select()
      .from(travelers)
      .where(eq(travelers.id, id))
      .limit(1);
    return traveler || null;
  }

  static async listTravelers(): Promise<Traveler[]> {
    const query = await db.select().from(travelers);
    return query;
  }

  static async updateTravelerById(
    id: number,
    traveler: UpdateTraveler
  ): Promise<Traveler | null> {
    const [updatedTraveler] = await db
      .update(travelers)
      .set(traveler)
      .where(eq(travelers.id, id))
      .returning();
    return updatedTraveler || null;
  }

  static async deleteTravelerById(id: number): Promise<Traveler | null> {
    const [deletedTraveler] = await db
      .delete(travelers)
      .where(eq(travelers.id, id))
      .returning();
    return deletedTraveler || null;
  }
}
