import Elysia, { t } from "elysia"
import authorization from "~/middlewares/authorization"

const orderController = new Elysia()
orderController
  .use(authorization)
  .post(
    "/item",
    async ({ request, body }) => {
      const id = request.headers.get("userId")
      const { order_id } = body
      try {
        // const orders = await prisma.orders.findUnique({ where: { id: order_id } })
        // const order_item = await prisma.order_items.findFirst({ where: { order_id: orders?.id || "" } })
        // const product = await prisma.products.findUnique({ where: { id: order_item?.product_id } })
        // const bank = await prisma.banks.findUnique({ where: { author_id: product?.author_id || "" } })
        // const payment = await prisma.payments.findUnique({
        //   where: {
        //     id: orders?.payment_id,
        //   },
        // })
        // const dataQR = await fetch("https://api.vietqr.io/v2/generate", {
        //   method: "POST",
        //   headers: {
        //     "x-client-id": Bun.env.CLIENT_ID || "",
        //     "x-api-key": Bun.env.API_KEY || "",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     accountNo: bank?.account_no || "",
        //     accountName: bank?.account_name || "",
        //     acqId: bank?.acqId || "",
        //     amount: payment?.amount || "",
        //     template: "qr_only",
        //   }),
        // })

        return {
          // data: await dataQR.json(),
        }
      } catch (error) {
        console.log("🚀 ~ file: order.controller.ts:28 ~ error:", error)
      }
    },
    {
      body: t.Object({
        order_id: t.String(),
      }),
      detail: {
        tags: ["ORDER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "",
    async ({ request, body }) => {
      const id = request.headers.get("userId") || ""
      const { cart_id } = body
      try {
        // const user = await prisma.users.findUnique({ where: { id } })
        // const cart_items = await prisma.cart_items.findMany({
        //   where: {
        //     cart_id,
        //   },
        // })
        // const amount = cart_items.reduce((totalAmount, currentItem) => {
        //   const { price, quantity } = currentItem
        //   return totalAmount + +price * quantity
        // }, 1)
        // const orders = {
        //   user_id: id || "",
        //   payment: {
        //     create: {
        //       amount,
        //       status: "Processing",
        //     },
        //   },
        //   order_items: {
        //     createMany: {
        //       data: cart_items.map((item) => {
        //         return {
        //           price: item.price,
        //           quantity: item.quantity,
        //         }
        //       }),
        //     },
        //   },
        // }
        // const payment = await prisma.payments.create({
        //   data: {
        //     amount,
        //   },
        // })
        // await prisma.orders.create({
        //   data: {
        //     user_id: id || "",
        //     payment_id: payment.id,
        //     order_items: {
        //       createMany: {
        //         data: cart_items.map((item) => {
        //           return {
        //             product_id: item.product_id,
        //             price: item.price,
        //             quantity: item.quantity,
        //           }
        //         }),
        //       },
        //     },
        //   },
        // })
        return {}
      } catch (error) {
        console.log("🚀 ------------------------------------------------🚀")
        console.log("🚀 ~ file: order.controller.ts:16 ~ error:", error)
        console.log("🚀 ------------------------------------------------🚀")
      }
    },
    {
      body: t.Object({
        cart_id: t.String(),
      }),
      detail: {
        tags: ["ORDER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default orderController
