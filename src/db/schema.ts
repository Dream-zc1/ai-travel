import { pgTable, serial, varchar, text, timestamp, boolean, numeric } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  region: varchar("region", { length: 100 }),
  location: varchar("location", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verificationCodes = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  used: boolean("used").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pinnedPlaces = pgTable("pinned_places", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  photo: text("photo"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const placeCheckins = pgTable("place_checkins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  placeName: varchar("place_name", { length: 255 }).notNull(),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  comment: text("comment"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
