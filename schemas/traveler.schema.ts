import { z } from 'zod';

export const travelerSchema = z.object({
  id: z.number(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Traveler = z.infer<typeof travelerSchema>;

export const newTravelerSchema = travelerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NewTraveler = z.infer<typeof newTravelerSchema>;

export type UpdateTraveler = Partial<Traveler>;
