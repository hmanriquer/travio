import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  isFirstTime: z.boolean().default(true).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;

export const newUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NewUser = z.infer<typeof newUserSchema>;

export type UpdateUser = Partial<User>;
