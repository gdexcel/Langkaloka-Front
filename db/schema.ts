import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

// USERS
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: text("email").notNull().unique(),
  name: text("name"),

  phone: text("phone").notNull().unique(),

  password: text("password").notNull(),

  address: text("address"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


// STORES
export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),

  ownerId: uuid("owner_id").notNull(),

  name: text("name").notNull(),

  description: text("description"),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})