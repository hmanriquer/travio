import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { travelers, travels } from '@/db/schema';
import type {
  NewTravel,
  Travel,
  TravelWithTraveler,
  UpdateTravel,
} from '@/schemas/travel.schema';
import { getInitials } from '@/utils/utils';

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

  static async listTravels(): Promise<TravelWithTraveler[]> {
    const query = await db
      .select({
        travel: travels,
        traveler: travelers,
      })
      .from(travels)
      .innerJoin(travelers, eq(travels.travelerId, travelers.id));

    return query.map(({ travel, traveler }) => ({
      ...travel,
      travelerName: traveler.name,
      travelerInitials: getInitials(traveler.name),
      travelerRole: travel.position,
    }));
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
