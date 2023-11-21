import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core"
import { categories } from "./categories"
import { users } from "./users"
import { cart_items } from "./carts"
import { order_items } from "./orders"

export const products = mysqlTable("products", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 32 }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  description: text("description").notNull(),
  location: varchar("location", { length: 32 }).notNull(),
  slug_location: varchar("slug_location", { length: 32 }),
  picture: varchar("picture", { length: 255 }),
  price: int("price", {}).notNull(),
  create_at: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
  categories_id: varchar("categories_id", { length: 32 }),
})

export const productsRelations = relations(products, ({ one, many }) => ({
  categories: one(categories, {
    fields: [products.categories_id],
    references: [categories.id],
  }),
  authors: one(users, {
    fields: [products.author_id],
    references: [users.id],
  }),
  cart_items: many(cart_items),
  order_items: many(order_items),
}))
