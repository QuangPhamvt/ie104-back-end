import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"

export * from "./banks"
export * from "./categories"
export * from "./products"
export * from "./users"
export * from "./carts"
export * from "./orders"

const uri = process.env.DATABASE_URL || ""
const poolConnection = mysql.createPool({
  uri,
})
const db = drizzle(poolConnection)
export default db
