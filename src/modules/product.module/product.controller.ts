import Elysia, { t } from "elysia"
import { AuthorizationMiddleWare, RoleMiddleWare } from "~/middlewares"
import { getObject, upload } from "../../../aws/s3"
interface Product {
  title: string
  description: string
  price: number
  discount: number
  categories_id: string
  author_id: string
}
const DETAIL = {
  detail: {
    tags: ["PRODUCT"],
  },
}
const productController = new Elysia()
productController
  // .get(
  //   "",
  //   async () => {
  //     const response = await fetch("https://api.vietqr.io/v2/generate", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         accountNo: "1025871607",
  //         accountName: "QUY VAC XIN PHONG CHONG COVID",
  //         acqId: "970436",
  //         addInfo: "Ung Ho Quy Vac Xin",
  //         amount: "79000",
  //         template: "t42wpo7",
  //       }),
  //       headers: {
  //         "x-client-id": Bun.env.CLIENT_ID || "",
  //         "x-api-key": Bun.env.API_KEY || "",
  //         "content-type": "application/json",
  //       },
  //     })
  //     return await response.json()
  //   },
  //   {
  //     ...DETAIL,
  //   },
  // )
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
  .use(AuthorizationMiddleWare)
  .use(RoleMiddleWare)
  .post(
    "",
    async ({ request, set, body }) => {
      const role = request.headers.get("role")
      const id = request.headers.get("userId")
      if (role !== "Seller") {
        set.status = 401
        return "Unauthorized"
      }
      const product: Product = {
        ...body,
        price: +body.price,
        discount: +body.discount,
        author_id: id || "",
      }
      console.log("🚀 ------------------------------------------------------🚀")
      console.log("🚀 ~ file: product.controller.ts:81 ~ product:", product)
      console.log("🚀 ------------------------------------------------------🚀")
      // const newProduct = await prisma.products.create({
      //   data: {
      //     ...product,
      //     picture: null,
      //   },
      // })
      // await prisma.products.update({
      //   where: {
      //     id: newProduct.id,
      //   },
      //   data: {
      //     picture: `product/${newProduct.id}/picture.webp`,
      //   },
      // })
      const blob = new Blob([body.picture], { type: "image" }) || ""
      // await upload(`product/${newProduct.id}/picture.webp`, blob, "image/webp")
      return request.headers.get("role")
    },
    {
      body: t.Object({
        title: t.String({ default: "Hai san tuoi ngon moi ngay" }),
        description: t.String({ default: "San cua CustomAFK sieu tuoi ngon moi ngay" }),
        price: t.String({ default: 60000 }),
        discount: t.String({ default: 2 }),
        categories_id: t.String({ default: "4bfefb8a-32ad-46c9-83fb-b720fd6211d2" }),
        picture: t.File({
          type: ["image"],
        }),
      }),
      detail: {
        tags: ["PRODUCT"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default productController
