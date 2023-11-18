import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"

export const banks = mysqlTable("banks", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 32 }).notNull(),
  acqId: varchar("acqId", { length: 255 }).notNull(),
  account_name: varchar("account_name", { length: 255 }).notNull(),
  account_no: varchar("account_no", { length: 255 }).notNull(),
})
export const banksRelations = relations(banks, ({ one }) => ({
  author: one(users, {
    fields: [banks.author_id],
    references: [users.id],
    relationName: "author_banks",
  }),
}))
