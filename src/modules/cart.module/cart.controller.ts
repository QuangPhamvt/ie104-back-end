import Elysia, { t } from "elysia"
import { AuthorizationMiddleWare } from "~/middlewares"
import { getObject } from "../../../aws/s3"

const cartController = new Elysia()
cartController
  .get("", () => {
    return "Hello world"
  })
  .use(AuthorizationMiddleWare)
  .get(
    "",
    async ({ request }) => {
      const id = request.headers.get("userId") || ""
      try {
        // const carts = await prisma.carts.findMany({
        //   where: {
        //     author_id: id,
        //   },
        //   select: {
        //     id: true,
        //     status: true,
        //     cart_items: {
        //       select: {
        //         price: true,
        //         quantity: true,
        //         create_at: true,
        //         product: {
        //           select: {
        //             title: true,
        //             picture: true,
        //             price: true,
        //             discount: true,
        //             author_id: false,
        //           },
        //         },
        //       },
        //     },
        //   },
        // })
        // const newCarts = await Promise.all(
        //   carts.map(async (cart) => {
        //     const newCart = await Promise.all(
        //       cart.cart_items.map(async (cart_item) => {
        //         const picture = await getObject(cart_item.product.picture || "")
        //         return {
        //           ...cart_item,
        //           product: {
        //             ...cart_item.product,
        //             picture,
        //           },
        //         }
        //       }),
        //     )
        //     return {
        //       ...cart,
        //       newCart,
        //     }
        //   }),
        // )
        return {
          // status: "Ok",
          // data: {
          //   carts: newCarts,
          // },
        }
      } catch (error) {
        console.log(error)
      }
    },
    {
      detail: {
        tags: ["CART"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "",
    async ({ request, body }) => {
      const id = request.headers.get("userId") || ""
      try {
        // await prisma.carts.create({
        //   data: {
        //     author_id: id,
        //     cart_items: {
        //       create: body.cart.map((cart) => {
        //         return {
        //           ...cart,
        //         }
        //       }),
        //     },
        //   },
        // })
      } catch (error) {
        console.log("🚀 -----------------------------------------------🚀")
        console.log("🚀 ~ file: cart.controller.ts:22 ~ error:", error)
        console.log("🚀 -----------------------------------------------🚀")
      }
    },
    {
      body: t.Object(
        {
          cart: t.Array(
            t.Object({
              product_id: t.String(),
              price: t.Number(),
              quantity: t.Number(),
            }),
          ),
        },
        {
          default: {
            cart: [
              {
                product_id: "a5ea1b6a-a02e-4500-9186-985fe7903d1e",
                price: 40000,
                quantity: 2,
              },
              {
                product_id: "db7a31e6-acb8-4a24-b102-4f56bd1862df",
                price: 60000,
                quantity: 3,
              },
              {
                product_id: "e99f9d65-4b4a-4a70-90b4-af761b0f1c0c",
                price: 44400,
                quantity: 2,
              },
            ],
          },
        },
      ),
      detail: {
        tags: ["CART"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default cartController
