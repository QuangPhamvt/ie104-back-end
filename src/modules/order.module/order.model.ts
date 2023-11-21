import Elysia, { t } from "elysia"

export const postFindOrderByCartBodyDto = t.Object({
  cart_id: t.String(),
})
export const postFindOrderByCartResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      cart: t.Object({
        cart_id: t.String(),
        price: t.Number(),
        cart_items: t.Array(
          t.Object({
            product: t.Object({
              product_id: t.String(),
              title: t.String(),
              price: t.Number(),
            }),
            quantity: t.Number(),
          }),
        ),
      }),
      seller: t.Object({
        seller_id: t.String(),
        username: t.String(),
        qr: t.String(),
      }),
    }),
  ),
})
export const postCreateOrderBodyDto = t.Object({
  seller_id: t.String(),
  cart_id: t.String(),
  price: t.Number(),
  products: t.Array(
    t.Object({
      product_id: t.String(),
      quantity: t.Number(),
    }),
  ),
})
export const postCreateOrderResponseDto = t.Object({
  message: t.String(),
})

const orderModel = new Elysia().model({
  postCreateOrderBody: postCreateOrderBodyDto,
  postCreateOrderResponse: postCreateOrderResponseDto,
  postFindOrderByCartBody: postFindOrderByCartBodyDto,
  postFindOrderByCartResponse: postFindOrderByCartResponseDto,
})
export default orderModel
