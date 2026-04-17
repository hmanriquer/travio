import { relations } from "drizzle-orm"
import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Define enums
export const roleEnum = pgEnum("role", ["master", "admin"])
export const statusEnum = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "PROVEN",
  "COMPLETED",
  "REJECTED",
])

// Users table (for Authentication - master and other admins)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Travelers table (informative only)
export const travelers = pgTable("travelers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  baseRegion: varchar("base_region", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Travel Requests table
export const travelRequests = pgTable("travel_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  travelerId: uuid("traveler_id")
    .references(() => travelers.id, { onDelete: "cascade" })
    .notNull(),
  destinationRegion: varchar("destination_region", { length: 255 }).notNull(),
  travelReason: text("travel_reason").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: integer("days"),
  proofDeadline: date("proof_deadline"),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }),
  provenAmount: numeric("proven_amount", { precision: 10, scale: 2 }),
  differenceFavorTraveler: numeric("difference_favor_traveler", {
    precision: 10,
    scale: 2,
  }),
  differenceFavorCompany: numeric("difference_favor_company", {
    precision: 10,
    scale: 2,
  }),
  isProvenOnTime: boolean("is_proven_on_time").default(false),
  isProvenLate: boolean("is_proven_late").default(false),
  proofDate: date("proof_date"),
  requestEmail: varchar("request_email", { length: 255 }),
  status: statusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ── Relations ──────────────────────────────────────────────────────────────────

export const travelersRelations = relations(travelers, ({ many }) => ({
  travelRequests: many(travelRequests),
}))

export const travelRequestsRelations = relations(travelRequests, ({ one }) => ({
  traveler: one(travelers, {
    fields: [travelRequests.travelerId],
    references: [travelers.id],
  }),
}))
