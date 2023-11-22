import { SetElysia } from "config"
import { like } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import db, { carts, order_items, orders } from "~/database/schema"

type postCreateOrderDto = {
  headers: Headers
  body: {
    seller_id: string
    cart_id: string
    price: number
    products: {
      product_id: string
      quantity: number
    }[]
  }
  set: SetElysia
}
export const postCreateOrder = async <T extends postCreateOrderDto>(props: T) => {
  const { headers, body, set } = props
  const buyer_id = headers.get("userId") || ""
  const { seller_id, products, price, cart_id } = body
  const order_id = uuidv4()
  try {
    await db.insert(orders).values({ id: order_id, cart_id, price, buyer_id, seller_id })
    await Promise.all(
      products.map(async (item) => {
        await db.insert(order_items).values({ order_id, product_id: item.product_id, quantity: item.quantity })
      }),
    )
    await db.update(carts).set({ status: "processing" }).where(like(carts.id, cart_id))
    return {
      message: "Oke",
    }
  } catch (error) {
    console.log(error)
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
    }
  }
}
