import Elysia, { t } from "elysia"
import { IMAGE } from "~/utilities"

const DEFAULT_CREATE_PRODUCT_BODY = {
  title: "Pho",
  description: "Phở Nhà làm",
  location: "Thành phố Hồ Chí Minh",
  picture: IMAGE,
  price: 300,
  categories_id: "bfe0dab6-85c6-11ee-9ea3-063ae024",
}
const DEFAULT_CREATE_CATEGORIES = {
  name: "Breakfirst",
  description: "Good Morning",
}
const postSearchProductByIdBodyDto = t.Object({
  id: t.String(),
})
const postSearchProductByIdResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Union([
      t.Object({
        id: t.String(),
        title: t.String(),
        picture: t.String(),
        description: t.String(),
        price: t.Number(),
        location: t.String(),
        create_at: t.String(),
        author: t.Object({
          author_id: t.String(),
          username: t.String(),
        }),
        categories: t.Object({
          categories_id: t.String(),
          categories_name: t.String(),
        }),
      }),
      t.Object({}),
    ]),
  ),
})
const postSearchProductBodyDto = t.Partial(
  t.Object({
    slug: t.String({ default: "pho" }),
    location: t.String({ default: "Hồ cHÍ minh" }),
    limit: t.Number({ default: 6 }),
    page: t.Number({ default: 1 }),
  }),
)
const postSearchProductResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Union([
      t.Object({
        id: t.String({ format: "uuid" }),
        title: t.String(),
        picture: t.String(),
        location: t.String(),
        price: t.Number(),
        author: t.Object({
          author_id: t.String(),
          username: t.String(),
        }),
      }),
      t.Object({}),
    ]),
  ),
})

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
  location: t.String({ default: DEFAULT_CREATE_PRODUCT_BODY.location }),
  picture: t.String({ contentEncoding: "base64", default: DEFAULT_CREATE_PRODUCT_BODY.picture }),
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
const postFindProductByCategoryBodyDto = t.Object({
  categories_id: t.String({ default: "bfe0dab6-85c6-11ee-9ea3-063ae024" }),
  author_id: t.String({ default: "89d057c5-85c3-11ee-9ea3-063ae024" }),
})
const postFindProductByCategoryResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      product_id: t.String(),
      title: t.String(),
      picture: t.String(),
      description: t.String(),
      price: t.Number(),
    }),
  ),
})
export const productModel = new Elysia().model({
  postSearchProductByIdBody: postSearchProductByIdBodyDto,
  postSearchProductByIdResponse: postSearchProductByIdResponseDto,

  postSearchProductBody: postSearchProductBodyDto,
  postSearchProductResponse: postSearchProductResponseDto,

  getCategoriesResponse: getCategoriesResponseDto,

  postFindProductByCategoryBody: postFindProductByCategoryBodyDto,
  postFindProductByCategoryResponse: postFindProductByCategoryResponseDto,

  createProductBody: createProductBodyDto,
  createProductResponse: createProductResponse,

  createCategoriesBody: createCategoriesBodyDto,
  createCategoriesResponse: createCategoriesResponseDto,
})
