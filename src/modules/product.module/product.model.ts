import Elysia, { t } from "elysia"

const createProductBodyDto = t.Object({
  title: t.String(),
  description: t.String(),
})
export const productModel = new Elysia().model({
  createProductBody: createProductBodyDto,
})
