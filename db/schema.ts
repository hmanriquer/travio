import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
  password: text('password'),
  isFirstTime: boolean('is_first_time').default(true).notNull(),
  ...timestamps,
});

export const travelers = pgTable('travelers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ...timestamps,
});

export const travels = pgTable('travels', {
  id: serial('id').primaryKey(),
  travelerId: integer('traveler_id')
    .notNull()
    .references(() => travelers.id, { onDelete: 'cascade' }),
  from: text('from').notNull(),
  to: text('to').notNull(),
  totalAmount: integer('total_amount').notNull(),
  limit: integer('limit').notNull(),
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
