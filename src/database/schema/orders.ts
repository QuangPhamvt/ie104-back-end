import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar, int, datetime } from "drizzle-orm/mysql-core"
import { products } from "./products"
import { carts } from "./carts"

export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  cart_id: varchar("cart_id", { length: 32 }).notNull(),
  seller_id: varchar("seller_id", { length: 32 }).notNull(),
  buyer_id: varchar("buyer_id", { length: 32 }).notNull(),
  status: varchar("status", { length: 32, enum: ["processing", "deny", "ordered"] })
    .default("processing")
    .notNull(),
  price: int("price").notNull(),
  create_at: datetime("create_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(order_items),
  carts: one(carts, {
    fields: [orders.cart_id],
    references: [carts.id],
  }),
}))

export const order_items = mysqlTable("order_items", {
  order_id: varchar("order_id", { length: 32 }).notNull(),
  product_id: varchar("product_id", { length: 32 }).notNull(),
  quantity: int("quantity").notNull(),
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
