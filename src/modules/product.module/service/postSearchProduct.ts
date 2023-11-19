import { SetElysia } from "config"
import { and, like, desc } from "drizzle-orm"
import db, { products, users } from "~/database/schema"
import { s3ObjectUrl } from "../../../../aws/s3"
import { toSlug } from "~/utilities"

type postSearchProductDto = {
  headers: Headers
  set: SetElysia
  body: {
    slug?: string
    location?: string
    limit?: number
    page?: number
  }
}
export const postSearchProduct = async <T extends postSearchProductDto>(props: T) => {
  const {
    body: { slug, location, limit, page },
    set,
  } = props
  try {
    let product
    if (!limit || !page) {
      set.status = 400
      return {
        message: "Bad Request",
        data: [],
      }
    }
    if (!!slug) {
      product = await db
        .select({
          id: products.id,
          title: products.title,
          picture: products.picture,
          location: products.location,
          price: products.price,
          author: {
            author_id: users.id,
            username: users.username,
          },
        })
        .from(products)
        .innerJoin(users, like(products.author_id, users.id))
        .where(and(like(products.slug, `%${slug}%`), like(users.role, "seller")))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(products.create_at))
    }
    if (!!location) {
      const slug_location = toSlug(location)
      product = await db
        .select({
          id: products.id,
          title: products.title,
          picture: products.picture,
          location: products.location,
          price: products.price,
          author: {
            author_id: users.id,
            username: users.username,
          },
        })
        .from(products)
        .where(and(like(products.slug_location, `%${slug_location}%`), like(users.role, "seller")))
        .innerJoin(users, like(products.author_id, users.id))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(products.create_at))
    }
    if (!product) {
      set.status = 400
      return {
        message: "Bad request",
        data: [],
      }
    }
    return {
      message: "Ok",

      data: product.map((item) => {
        if (item.picture) return { ...item, picture: s3ObjectUrl(item.picture) }
        else return item
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
