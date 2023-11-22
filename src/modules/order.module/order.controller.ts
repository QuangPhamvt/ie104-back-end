import Elysia, { t } from "elysia"
import orderModel from "./order.model"
import orderService from "./service"
import { AuthorizationMiddleWare } from "~/middlewares"
import roleMiddleware from "~/middlewares/role"

const orderController = new Elysia()
orderController
  .use(AuthorizationMiddleWare)
  .use(roleMiddleware)
  .use(orderModel)
  .get(
    "/",
    ({ request: { headers }, set }) => {
      return orderService.findOrderList({ headers, set })
    },
    {
      response: "findOrderListResponse",
      detail: {
        tags: ["ORDER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/update",
    ({ request: { headers }, body, set }) => {
      return orderService.updateStatusOrder({ headers, body, set })
    },
    {
      body: "updateStatusOrderBody",
      response: "updateStatusOrderResponse",
      detail: {
        tags: ["ORDER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
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
