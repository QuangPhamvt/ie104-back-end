import { relations, sql } from "drizzle-orm"
import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core"
import { products } from "./products"

export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 12 })
    .primaryKey()
    .default(sql`(uuid())`),
  name: varchar("name", { length: 100 }),
  slug: varchar("slug", { length: 100 }),
  description: text("description"),
})
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))
