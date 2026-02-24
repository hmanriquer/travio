import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { travels } from '@/db/schema';
import type { NewTravel, Travel, UpdateTravel } from '@/schemas/travel.schema';

export class TravelService {
  constructor() {}

  static async createTravel(travel: NewTravel): Promise<Travel> {
    const [newTravel] = await db.insert(travels).values(travel).returning();
    return newTravel;
  }

  static async getTravelById(id: number): Promise<Travel | null> {
    const [travel] = await db
      .select()
      .from(travels)
      .where(eq(travels.id, id))
      .limit(1);
    return travel || null;
  }

  static async listTravels(): Promise<Travel[]> {
    const query = await db.select().from(travels);
    return query;
  }

  static async updateTravelById(
    id: number,
    travel: UpdateTravel
  ): Promise<Travel | null> {
    const [updatedTravel] = await db
      .update(travels)
      .set(travel)
      .where(eq(travels.id, id))
      .returning();
    return updatedTravel || null;
  }

  static async deleteTravelById(id: number): Promise<Travel | null> {
    const [deletedTravel] = await db
      .delete(travels)
      .where(eq(travels.id, id))
      .returning();
    return deletedTravel || null;
  }
}
