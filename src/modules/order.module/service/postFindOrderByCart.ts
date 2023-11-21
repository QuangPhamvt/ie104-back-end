import { SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { banks, cart_items, carts, products, users } from "~/database/schema"

type postFindOrderByCartDto = {
  headers: Headers
  body: {
    cart_id: string
  }
  set: SetElysia
}
export const postFindOrderByCart = async <T extends postFindOrderByCartDto>(props: T) => {
  const {
    headers,
    body: { cart_id },
    set,
  } = props
  let cart_item
  const user_id = headers.get("userId") || ""
  try {
    const [cart] = await db
      .select({
        cart_id: carts.id,
        price: carts.price,
        status: carts.status,
      })
      .from(carts)
      .where(like(carts.id, cart_id))

    cart_item = await db.select().from(cart_items).where(like(cart_items.cart_id, cart_id))
    cart_item = await Promise.all(
      cart_item.map(async (item) => {
        const [product] = await db
          .select({
            product_id: products.id,
            title: products.title,
            price: products.price,
          })
          .from(products)
          .where(like(products.id, item.product_id || ""))
        return {
          product,
          quantity: item.quantity,
        }
      }),
    )

    console.log(cart_item)

    const [seller] = await db
      .select({
        seller_id: users.id,
        username: users.username,
      })
      .from(users)
      .innerJoin(products, like(products.author_id, users.id))
      .where(like(products.id, cart_item[0].product.product_id))

    const [bank] = await db.select().from(banks).where(like(banks.author_id, seller.seller_id))
    console.log(bank)

    let response: any = await fetch("https://api.vietqr.io/v2/generate", {
      method: "POST",
      headers: {
        "x-client-id": process.env.CLIENT_ID || "",
        "x-api-key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountNo: bank.account_no,
        accountName: bank.account_name,
        acqId: bank.acqId,
        addInfo: `Chuyen Tien cho ${bank.account_name}`,
        amount: cart.price,
        template: "t42wpo7",
      }),
    })
    response = await response.json()

    return {
      message: "Oke",
      data: [
        {
          cart: {
            cart_id: cart.cart_id,
            status: cart.status,
            price: cart.price,
            cart_items: cart_item,
          },
          seller: {
            seller_id: seller.seller_id,
            username: seller.username,
            qr: response.data,
          },
        },
      ],
    }
  } catch (error) {
    console.log(error)

    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
