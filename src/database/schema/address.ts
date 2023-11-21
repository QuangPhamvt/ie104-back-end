import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"

export const address = mysqlTable("address", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  province: varchar("province", { length: 50 }),
  district: varchar("district", { length: 50 }),
  ward: varchar("ward", { length: 50 }),
})
