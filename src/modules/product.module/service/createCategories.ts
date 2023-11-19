import db, { categories } from "~/database/schema"
import { toSlug } from "~/utilities"

type createCategoriesDto = {
  body: {
    name: string
    description: string
  }
}
export const createCategories = async <T extends createCategoriesDto>(props: T) => {
  const {
    body: { name, description },
  } = props
  const slug = toSlug(name)
  try {
    await db.insert(categories).values({ slug, description, name })
    return {
      message: "Ok",
    }
  } catch (error) {
    console.log(error)
    return {
      message: "Have something wrong",
    }
  }
}
