import { SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { carts } from "~/database/schema"

type getCartListDto = {
  headers: Headers
  set: SetElysia
}
const getCartList = async <T extends getCartListDto>(props: T) => {
  const { headers, set } = props
  const id = headers.get("userId")
  if (!id) {
    set.status = 400
    return {
      message: "Bad request",
      data: [],
    }
  }
  try {
    const cartList = await db
      .select({ id: carts.id, status: carts.status, price: carts.price, create_at: carts.create_at })
      .from(carts)
      .where(like(carts.author_id, id))
    return {
      message: "Ok",
      data: cartList,
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}

export default getCartList
