import db, { categories } from "~/database/schema"

export const getCategories = async () => {
  try {
    const data = await db.select({ id: categories.id, name: categories.name }).from(categories)
    return {
      message: "Oke",
      data: data || [],
    }
  } catch (error) {
    return {
      message: "Bad request",
      data: [],
    }
  }
}
