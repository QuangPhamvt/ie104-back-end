import { SetElysia } from "config"
import { desc, like } from "drizzle-orm"
import db, { categories, products } from "~/database/schema"
import { toSlug } from "~/utilities"
import { upload } from "../../../aws/s3"

type createProductDto = {
  headers: Headers
  set: SetElysia
  body: {
    title: string
    description: string
    location: string
    picture: string
    price: number
    categories_id: string
  }
}
type createCategoriesDto = {
  body: {
    name: string
    description: string
  }
}
// PRODUCT SERVICE
const productService = {
  getCategories: async () => {
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
  },
  // CREATE PRODUCT
  createProduct: async <T extends createProductDto>(props: T) => {
    const {
      headers,
      set,
      body: { title, description, picture, price, categories_id, location },
    } = props
    const id = headers.get("userId") || ""
    const role = headers.get("role") || ""
    if (role !== "seller") {
      set.status = 403
      return {
        message: "Forbidden",
      }
    }
    try {
      const slug = toSlug(title)
      await db
        .insert(products)
        .values({ title, slug, description, location, picture: null, price, categories_id, author_id: id })
      const [product] = await db
        .select()
        .from(products)
        .where(like(products.author_id, id))
        .limit(1)
        .orderBy(desc(products.create_at))
      const blob = await fetch(picture).then((res) => res.blob())
      const urlUpload = `IE104/users/${id}/products/${product.id}.webp`
      await upload(urlUpload, blob, "image/webp")
      await db.update(products).set({ picture: urlUpload }).where(like(products.id, product.id))
      return {
        message: "Ok",
      }
    } catch (error) {
      set.status = 400
      console.log(error)
      return {
        message: "Bad request",
      }
    }
  },
  // CREATE CATEGORIES
  createCategories: async <T extends createCategoriesDto>(props: T) => {
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
  },
}

export default productService
