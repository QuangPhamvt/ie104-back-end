import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar, int, datetime } from "drizzle-orm/mysql-core"
import { products } from "./products"

export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  seller_id: varchar("seller_id", { length: 32 }),
  buyer_id: varchar("buyer_id", { length: 32 }),
  status: varchar("status", { length: 32, enum: ["processing", "deny", "ordered"] }).default("processing"),
  price: int("price"),
  create_at: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
})
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(order_items),
}))

export const order_items = mysqlTable("order_items", {
  order_id: varchar("order_id", { length: 32 }),
  product_id: varchar("product_id", { length: 32 }),
  quantity: int("quantity"),
})
export const order_itemsRelations = relations(order_items, ({ one }) => ({
  products: one(products, {
    fields: [order_items.product_id],
    references: [products.id],
  }),
  orders: one(orders, {
    fields: [order_items.order_id],
    references: [orders.id],
  }),
}))
