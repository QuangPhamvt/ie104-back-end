import Elysia, { t } from "elysia"
import { AuthorizationMiddleWare, RoleMiddleWare } from "~/middlewares"
import { getObject, upload } from "../../../aws/s3"
import { productModel } from "./product.model"
import productService from "./product.service"
const productController = new Elysia()

productController
  .use(productModel)
  .get(
    "",
    async ({ query }) => {
      const { limit = 5, page = 1 } = query
      const skip = limit && page ? +limit * (+page - 1) : 5
      // const products = await prisma.products.findMany({
      //   skip,
      //   take: !!limit ? +limit : 5,
      // })
      // const data = await Promise.all(
      //   products.map(async (product) => {
      //     if (!product.picture) return null
      //     const picture = await getObject(product.picture)
      //     return {
      //       ...product,
      //       picture,
      //     }
      //   }),
      // )
      return {
        // data,
      }
    },
    {
      detail: {
        tags: ["PRODUCT"],
        parameters: [
          { in: "query", name: "page" },
          { in: "query", name: "limit" },
        ],
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
