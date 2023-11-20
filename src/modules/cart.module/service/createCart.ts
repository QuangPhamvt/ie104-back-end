import { SetElysia } from "config"
import { desc, like } from "drizzle-orm"
import db, { carts, cart_items } from "~/database/schema"

type createCartDto = {
  headers: Headers
  body: {
    price: number
    cart_items: {
      product_id: string
      quantity: number
    }[]
  }
  set: SetElysia
}

const createCart = async <T extends createCartDto>(props: T) => {
  const {
    headers,
    body: { price, cart_items: Cart_items },
    set,
  } = props
  const id = headers.get("userId")
  if (!id) {
    set.status = 400
    return {
      message: "Bad request",
    }
  }
  try {
    await db.insert(carts).values({ author_id: id, status: "prepare", price })
    const [cart] = await db
      .select()
      .from(carts)
      .where(like(carts.author_id, id))
      .limit(1)
      .orderBy(desc(carts.create_at))
    Cart_items.map(async (item) => {
      const { product_id, quantity } = item
      await db.insert(cart_items).values({ cart_id: cart.id, product_id, quantity })
    })
    return {
      message: "Ok",
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
    }
  }
}

export default createCart
