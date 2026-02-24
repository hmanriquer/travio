import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';
import type { NewUser, User } from '@/schemas/user.schema';

export class AuthService {
  constructor() {}

  static async registerUser(user: NewUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        ...user,
        password: hashedPassword,
      })
      .returning();
    return newUser;
  }
}
