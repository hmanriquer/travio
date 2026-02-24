import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';
import type { NewUser, UpdateUser, User } from '@/schemas/user.schema';

export class UserService {
  constructor() {}

  static async createUser(user: NewUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  static async getUserById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user || null;
  }

  static async listUsers(): Promise<User[]> {
    const list = await db.select().from(users);
    return list;
  }

  static async updateUserById(
    id: number,
    user: UpdateUser
  ): Promise<User | null> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || null;
  }

  static async deleteUserById(id: number): Promise<User | null> {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return deletedUser || null;
  }
}
