import Elysia, { t } from "elysia"
import { AuthorizationMiddleWare, RoleMiddleWare } from "~/middlewares"
import { productModel } from "./product.model"
import productService from "./service"
const productController = new Elysia()

productController
  .use(productModel)
  .post(
    "/search-id",
    ({ request: { headers }, body, set }) => {
      return productService.postSearchProductById({ headers, body, set })
    },
    {
      body: "postSearchProductByIdBody",
      response: "postSearchProductByIdResponse",
      detail: { tags: ["PRODUCT"] },
    },
  )
  .post(
    "/search",
    ({ request: { headers }, body, set }) => {
      return productService.postSearchProduct({ headers, body, set })
    },
    {
      body: "postSearchProductBody",
      response: "postSearchProductResponse",
      detail: {
        tags: ["PRODUCT"],
      },
    },
  )
  .get(
    "/categories",
    () => {
      return productService.getCategories()
    },
    {
      response: "getCategoriesResponse",
      detail: {
        tags: ["PRODUCT"],
      },
    },
  )
  .post(
    "/search-product/categories",
    ({ request: { headers }, body, set }) => {
      return productService.postFindProductByCategory({ headers, body, set })
    },
    {
      body: "postFindProductByCategoryBody",
      response: "postFindProductByCategoryResponse",
      detail: {
        tags: ["PRODUCT"],
      },
    },
  )
  .use(AuthorizationMiddleWare)
  .use(RoleMiddleWare)
  .post(
    "/create-product",
    ({ request: { headers }, set, body }) => {
      return productService.createProduct({ headers, set, body })
    },
    {
      body: "createProductBody",
      response: "createProductResponse",
      detail: {
        tags: ["PRODUCT"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/create-categories",
    ({ body }) => {
      return productService.createCategories({ body })
    },

    {
      body: "createCategoriesBody",
      response: "createCategoriesResponse",
      detail: {
        tags: ["PRODUCT"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default productController
