import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

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
});

// STORES
export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),

  ownerId: uuid("owner_id").notNull(),

  name: text("name").notNull(),

  description: text("description"),

  image: text("image"), // 🔥 TAMBAH
  location: text("location"), // 🔥 TAMBAH
  vaNumber: text("va_number"),
  vaBank: text("vaBank"),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// CATEGORIES
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// PRODUCTS
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),

  storeId: uuid("store_id").notNull(),

  categoryId: uuid("category_id"),

  name: text("name").notNull(),

  description: text("description"),

  price: integer("price").notNull(),

  condition: text("condition"),

  isSold: boolean("is_sold").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// PRODUCT IMAGES
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id").notNull(),

  url: text("url").notNull(),
});

// FAVORITES
export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id").notNull(),

  productId: uuid("product_id").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// CHATS
export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id").notNull(),

  buyerId: uuid("buyer_id").notNull(),

  sellerId: uuid("seller_id").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MESSAGES
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id"),

  chatId: uuid("chat_id").notNull(),

  senderId: uuid("sender_id").notNull(),

  text: text("text").notNull(),

  type: text("type").notNull().default("text"), // 'text' | 'product'

  createdAt: timestamp("created_at").notNull().defaultNow(),
  readAt: timestamp("read_at"),
});

// Store Rating
export const storeRatings = pgTable("store_ratings", {
  id: uuid("id").defaultRandom().primaryKey(),

  storeId: uuid("store_id").notNull(),
  userId: uuid("user_id").notNull(),

  rating: integer("rating").notNull(), // 1 - 5

  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id").notNull(),
  buyerId: uuid("buyer_id").notNull(),

  proof: text("proof"),
  status: text("status").default("pending"), // pending | approved

  createdAt: timestamp("created_at").defaultNow(),
});