import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { db } from './db';
import { users } from './db/schema';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials;

        if (!username || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username as string))
          .limit(1);

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.password
        );

        if (passwordsMatch) return user as any;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
