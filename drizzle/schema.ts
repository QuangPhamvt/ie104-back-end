import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, varchar, primaryKey, text, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const banks = mysqlTable("banks", {
	id: varchar("id", { length: 12 }).default(sql`uuid()`).notNull(),
	authorId: varchar("author_id", { length: 12 }).references(() => users.id),
	acqId: varchar("acqId", { length: 255 }),
	accountName: varchar("account_name", { length: 255 }),
	accountNo: varchar("account_no", { length: 255 }),
});

export const categories = mysqlTable("categories", {
	id: varchar("id", { length: 12 }).default(sql`uuid()`).notNull(),
	name: varchar("name", { length: 100 }),
	slug: varchar("slug", { length: 100 }),
	description: text("description"),
},
(table) => {
	return {
		categoriesIdPk: primaryKey({ columns: [table.id], name: "categories_id_pk"}),
	}
});

export const products = mysqlTable("products", {
	id: varchar("id", { length: 12 }).default(sql`uuid()`).notNull(),
	authorId: varchar("author_id", { length: 12 }),
	title: varchar("title", { length: 255 }),
	description: text("description"),
	picture: varchar("picture", { length: 255 }),
	categoriesId: varchar("categories_id", { length: 12 }).references(() => categories.id),
},
(table) => {
	return {
		productsIdPk: primaryKey({ columns: [table.id], name: "products_id_pk"}),
	}
});

export const users = mysqlTable("users", {
	id: varchar("id", { length: 12 }).default(sql`uuid()`).notNull(),
	email: varchar("email", { length: 32 }),
	password: varchar("password", { length: 255 }).notNull(),
	role: varchar("role", { length: 6 }),
},
(table) => {
	return {
		usersIdPk: primaryKey({ columns: [table.id], name: "users_id_pk"}),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});