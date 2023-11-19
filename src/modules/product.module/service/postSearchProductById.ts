import { like } from "drizzle-orm"
import db, { products, categories, users } from "~/database/schema"
import { s3ObjectUrl } from "../../../../aws/s3"
import { SetElysia } from "config"

type postSearchProductByIdDto = {
  headers: Headers
  set: SetElysia
  body: {
    id: string
  }
}

export const postSearchProductById = async <T extends postSearchProductByIdDto>(props: T) => {
  const {
    body: { id },
    set,
  } = props
  try {
    const product = await db

      .select({
        id: products.id,
        title: products.title,
        picture: products.picture,
        description: products.description,
        price: products.price,
        location: products.location,
        create_at: products.create_at,
        author: {
          author_id: users.id,
          username: users.username,
        },
        categories: {
          categories_id: categories.id,
          categories_name: categories.name,
        },
      })
      .from(products)
      .innerJoin(categories, like(products.categories_id, categories.id))
      .innerJoin(users, like(users.id, products.author_id))
      .where(like(products.id, id))
    return {
      message: "Ok",
      data: product.map((item) => {
        if (item.picture) return { ...item, picture: s3ObjectUrl(item.picture) }
        else return item
      }),
    }
  } catch (error) {
    console.log(error)
    set.status = "Internal Server Error"
    return {
      message: "Internal Sever Error",
      data: [],
    }
  }
}
