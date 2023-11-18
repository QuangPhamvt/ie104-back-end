import Elysia, { t } from "elysia"
import { IMAGE } from "~/utilities"

const DEFAULT_CREATE_PRODUCT_BODY = {
  title: "Pho",
  description: "Phở Nhà làm",
  pricture: IMAGE,
  price: 300,
  categories_id: "bfe0dab6-85c6-11ee-9ea3-063ae024",
}
const DEFAULT_CREATE_CATEGORIES = {
  name: "Bearkfirst",
  description: "Good Morning",
}
const getCategoriesResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
    }),
  ),
})
const createProductBodyDto = t.Object({
  title: t.String({ default: DEFAULT_CREATE_PRODUCT_BODY.title }),
  description: t.String({ default: DEFAULT_CREATE_PRODUCT_BODY.description }),
  picture: t.String({ contentEncoding: "base64", default: DEFAULT_CREATE_PRODUCT_BODY.pricture }),
  price: t.Number({ default: DEFAULT_CREATE_PRODUCT_BODY.price }),
  categories_id: t.String({ default: DEFAULT_CREATE_PRODUCT_BODY.categories_id }),
})
const createProductResponse = t.Object({
  message: t.String(),
})
const createCategoriesBodyDto = t.Object({
  name: t.String({ default: DEFAULT_CREATE_CATEGORIES.name }),
  description: t.String({ default: DEFAULT_CREATE_CATEGORIES.description }),
})
const createCategoriesResponseDto = t.Object({
  message: t.String(),
})
export const productModel = new Elysia().model({
  getCategoriesResponse: getCategoriesResponseDto,
  createProductBody: createProductBodyDto,
  createProductResponse: createProductResponse,
  createCategoriesBody: createCategoriesBodyDto,
  createCategoriesResponse: createCategoriesResponseDto,
})
