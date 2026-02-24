import { z } from 'zod';

export const travelSchema = z.object({
  id: z.number(),
  travelerId: z.number(),
  from: z.string().min(3, 'From must be at least 3 characters long'),
  to: z.string().min(3, 'To must be at least 3 characters long'),
  totalAmount: z.number(),
  limit: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Travel = z.infer<typeof travelSchema>;

export const newTravelSchema = travelSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NewTravel = z.infer<typeof newTravelSchema>;

export type UpdateTravel = Partial<Travel>;
