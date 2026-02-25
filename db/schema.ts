import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

/**
 * Shared timestamp columns to avoid repetition
 */
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  password: text('password').notNull(),
  isFirstTime: boolean('is_first_time').default(true).notNull(),
  ...timestamps,
});

export const accounts = pgTable(
  'accounts',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const travelers = pgTable('travelers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ...timestamps,
});

export const travelStatusEnum = pgEnum('travel_status', [
  'approved',
  'pending',
  'rejected',
]);

export const travels = pgTable('travels', {
  id: serial('id').primaryKey(),
  travelerId: integer('traveler_id')
    .notNull()
    .references(() => travelers.id, { onDelete: 'cascade' }),
  from: text('from').notNull(),
  to: text('to').notNull(),
  position: text('position').notNull(),
  totalAmount: integer('total_amount').notNull(),
  limit: integer('limit').notNull(),
  status: travelStatusEnum('status').default('pending').notNull(),
  ...timestamps,
});

/**
 * Relations definitions for easy querying
 */
export const travelersRelations = relations(travelers, ({ many }) => ({
  travels: many(travels),
}));

export const travelsRelations = relations(travels, ({ one }) => ({
  traveler: one(travelers, {
    fields: [travels.travelerId],
    references: [travelers.id],
  }),
}));

/**
 * Type exports for use throughout the application
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Traveler = typeof travelers.$inferSelect;
export type NewTraveler = typeof travelers.$inferInsert;

export type Travel = typeof travels.$inferSelect;
export type NewTravel = typeof travels.$inferInsert;
