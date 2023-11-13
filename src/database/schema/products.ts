import { relations, sql } from "drizzle-orm"
import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core"
import { categories } from "./categories"
import { users } from "./users"

export const products = mysqlTable("products", {
  id: varchar("id", { length: 12 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 12 }),
  title: varchar("title", { length: 255 }),
  slug: varchar("title", { length: 255 }),
  description: text("description"),
  picture: varchar("picture", { length: 255 }),
  categories_id: varchar("categories_id", { length: 12 }),
})

export const productsRelations = relations(products, ({ one }) => ({
  categories: one(categories, {
    fields: [products.categories_id],
    references: [categories.id],
  }),
  authors: one(users, {
    fields: [products.author_id],
    references: [users.id],
  }),
}))
