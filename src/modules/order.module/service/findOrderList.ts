import { SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { order_items, orders, products, users } from "~/database/schema"
import { address } from "~/database/schema/address"

type findOrderListDto = {
  headers: Headers
  set: SetElysia
}
export const findOrderList = async <T extends findOrderListDto>(props: T) => {
  const { headers, set } = props
  const seller_id = headers.get("userId") || ""
  const seller_role = headers.get("role")
  console.log(seller_role)
  // CHECK IF A SELLER
  if (seller_role !== "seller") {
    set.status = 400
    return {
      message: "Bad request",
      data: [],
    }
  }

  try {
    let orderList = await db
      .select({
        order_id: orders.id,
        status: orders.status,
        price: orders.price,
        buyer: {
          buyer_id: users.id,
          username: users.username,
          province: address.province,
          district: address.district,
          ward: address.ward,
        },
      })
      .from(orders)
      .innerJoin(users, like(orders.buyer_id, users.id))
      .innerJoin(address, like(users.address_id, address.id))
      .where(like(orders.seller_id, seller_id))

    const data = await Promise.all(
      orderList.map(async (item) => {
        const order_item = await db
          .select({
            product_id: order_items.product_id,
            title: products.title,
            quantity: order_items.quantity,
          })
          .from(order_items)
          .innerJoin(products, like(products.id, order_items.product_id))
          .where(like(order_items.order_id, item.order_id))
        return {
          ...item,
          order_items: order_item,
        }
      }),
    )

    return {
      message: "Oke",
      data,
    }
  } catch (error) {
    console.log(error)
    return {
      message: "Oke",
      data: [],
    }
  }
}
