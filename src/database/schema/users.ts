import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { products } from "./products"
import { carts } from "./carts"
import { address } from "./address"

export const users = mysqlTable(`users`, {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  email: varchar("email", { length: 32 }).unique(),
  username: varchar("username", { length: 252 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 6, enum: ["buyer", "seller"] }),
  address_id: varchar("address_id", { length: 32 }),
})
export const usersRelations = relations(users, ({ many, one }) => ({
  products: many(products),
  carts: many(carts),
  address: one(address, {
    fields: [users.address_id],
    references: [address.id],
  }),
}))
