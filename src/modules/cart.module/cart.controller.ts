import Elysia from "elysia"
import { AuthorizationMiddleWare } from "~/middlewares"
import cartModel from "./cart.model"
import cartService from "./service"

const cartController = new Elysia()
cartController
  .use(cartModel)
  .use(AuthorizationMiddleWare)
  .get(
    "",
    ({ request: { headers }, set }) => {
      return cartService.getCartList({ headers, set })
    },
    {
      response: "getCartListResponse",
      detail: {
        tags: ["CART"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/create",
    ({ request: { headers }, body, set }) => {
      return cartService.createCart({ headers, body, set })
    },
    {
      body: "createCartBody",
      response: "createCartResponse",
      detail: {
        tags: ["CART"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default cartController
