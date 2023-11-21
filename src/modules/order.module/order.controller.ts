import Elysia, { t } from "elysia"
import orderModel from "./order.model"
import orderService from "./service"
import { AuthorizationMiddleWare } from "~/middlewares"

const orderController = new Elysia()
orderController
  .use(AuthorizationMiddleWare)
  .use(orderModel)
  .post(
    "/create",
    ({ request: { headers }, body, set }) => {
      return orderService.postCreateOrder({ headers, body, set })
    },
    {
      body: "postCreateOrderBody",
      response: "postCreateOrderResponse",
      detail: {
        tags: ["ORDER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/find/cartId",
    ({ request: { headers }, body, set }) => {
      return orderService.postFindOrderByCart({ headers, body, set })
    },
    {
      body: "postFindOrderByCartBody",
      detail: {
        tags: ["ORDER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default orderController
