import { prisma } from "config"
import Elysia, { t } from "elysia"
import { AuthorizationMiddleWare } from "~/middlewares"

const cartController = new Elysia()
cartController
  .get("", () => {
    return "Hello world"
  })
  .use(AuthorizationMiddleWare)
  .post(
    "",
    async ({ request, body }) => {
      const id = request.headers.get("userId") || ""
      try {
        await prisma.carts.create({
          data: {
            author_id: id,
            cart_items: {
              create: body.cart.map((cart) => {
                return {
                  ...cart,
                }
              }),
            },
          },
        })
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
