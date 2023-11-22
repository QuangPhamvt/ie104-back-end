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
  try {
    if (body.status === "deny") {
      await db.update(orders).set({ status: "deny" }).where(like(orders.id, body.order_id))
    }
    if (body.status === "ordered") {
      await db.update(orders).set({ status: "ordered" }).where(like(orders.id, body.order_id))
    }
    return { message: "Oke" }
  } catch (error) {
    console.log(error)
    return {
      message: "Oke",
    }
  }
}
