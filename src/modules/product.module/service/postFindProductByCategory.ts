import { SetElysia } from "config"
import { and, desc, like } from "drizzle-orm"
import db, { categories, products } from "~/database/schema"
import { s3ObjectUrl } from "../../../../aws/s3"

type postFindProductByCategoryDto = {
  headers: Headers
  body: {
    categories_id: string
    author_id: string
  }
  set: SetElysia
}
const postFindProductByCategory = async <T extends postFindProductByCategoryDto>(props: T) => {
  const {
    headers,
    body: { categories_id, author_id },
    set,
  } = props
  try {
    const data = await db
      .select({
        product_id: products.id,
        title: products.title,
        picture: products.picture,
        description: products.description,
        price: products.price,
      })
      .from(products)
      .innerJoin(categories, like(categories.id, products.categories_id))
      .where(and(like(products.author_id, author_id), like(categories.id, categories_id)))
      .orderBy(desc(products.create_at))
    return {
      message: "Ok",
      data: data.map((item) => {
        return { ...item, picture: s3ObjectUrl(item.picture || "") }
      }),
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}

export default postFindProductByCategory
