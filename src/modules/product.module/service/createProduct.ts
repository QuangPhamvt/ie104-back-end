import { SetElysia } from "config"
import { like, desc } from "drizzle-orm"
import db, { products } from "~/database/schema"
import { toSlug } from "~/utilities"
import { upload } from "../../../../aws/s3"

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
export const createProduct = async <T extends createProductDto>(props: T) => {
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
    await db.insert(products).values({
      title,
      slug,
      description,
      location,
      slug_location: toSlug(location),
      picture: null,
      price,
      categories_id,
      author_id: id,
    })
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
}
