import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { products } from "./products"
import { users } from "./users"

export const carts = mysqlTable("carts", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 32 }),
  status: varchar("status", { length: 12, enum: ["prepare", "deny", "processing", "ordered"] }),
  price: int("price").notNull(),
  create_at: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
  update_at: datetime("update_at"),
})
export const cartsRelations = relations(carts, ({ many, one }) => ({
  authors: one(users, {
    fields: [carts.author_id],
    references: [users.id],
  }),
  cart_items: many(cart_items),
}))
export const cart_items = mysqlTable(
  "cart_items",
  {
    cart_id: varchar("cart_id", { length: 32 }),
    product_id: varchar("product_id", { length: 32 }),
    quantity: int("quantity"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cart_id, t.product_id] }),
  }),
)
export const cart_itemsRelations = relations(cart_items, ({ one }) => ({
  carts: one(carts, {
    fields: [cart_items.cart_id],
    references: [carts.id],
  }),
  products: one(products, {
    fields: [cart_items.product_id],
    references: [products.id],
  }),
}))
