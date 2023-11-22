import { SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { carts, orders } from "~/database/schema"

type updateStatusOrderDto = {
  headers: Headers
  body: {
    status: string
    order_id: string
  }
  set: SetElysia
}
export const updateStatusOrder = async <T extends updateStatusOrderDto>(props: T) => {
  const { headers, body, set } = props
  const seller_id = headers.get("userId")
  const role = headers.get("role")
  if (role !== "seller") {
    set.status = 400
    return {
      message: "Bad request",
    }
  }
  try {
    const [order] = await db.select().from(orders).where(like(orders.id, body.order_id))
    if (body.status === "deny") {
      await db.update(orders).set({ status: "deny" }).where(like(orders.id, body.order_id))
      await db.update(carts).set({ status: "deny" }).where(like(carts.id, order.cart_id))
    }
    if (body.status === "ordered") {
      await db.update(orders).set({ status: "ordered" }).where(like(orders.id, body.order_id))
      await db.update(carts).set({ status: "ordered" }).where(like(carts.id, order.cart_id))
    }
    return { message: "Oke" }
  } catch (error) {
    console.log(error)
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
    }
  }
}
