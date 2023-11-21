import Elysia, { t } from "elysia"

const getCartListResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      id: t.String(),
      status: t.Union([
        t.Literal("prepare"),
        t.Literal("ordered"),
        t.Literal("deny"),
        t.Literal("processing"),
        t.Null(),
      ]),
      price: t.Number(),
      create_at: t.Union([t.Date(), t.Null()]),
    }),
  ),
})

const createCartBodyDto = t.Object({
  price: t.Number({ default: 100 }),
  cart_items: t.Array(
    t.Object({
      product_id: t.String({ default: "a92ba01c-86ac-11ee-9ea3-063ae024" }),
      quantity: t.Number({ default: 2 }),
    }),
  ),
})
const createCartResponseDto = t.Object({
  message: t.String(),
})

const cartModel = new Elysia().model({
  getCartListResponse: getCartListResponseDto,
  createCartBody: createCartBodyDto,
  createCartResponse: createCartResponseDto,
})
export default cartModel
