import swagger from "@elysiajs/swagger"
import Elysia, { t } from "elysia"
import { getObject, upload } from "../../../aws/s3"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, prisma } from "config"
import authorization from "~/middlewares/authorization"
import { getAvatar, uploadAvatar } from "./user.service"
import { RoleMiddleWare } from "~/middlewares"

const DETAIL = {
  detail: {
    tags: ["USER"],
    security: [{ BearerAuth: [] }],
  },
}
const userController = new Elysia()
userController
  .use(authorization)
  .get(
    "/avatar",
    async ({ request, set }) => {
      return await getAvatar(request, set)
    },
    {
      ...DETAIL,
    },
  )
  .post(
    "/avatar/upload",
    async ({ request, body, set }) => {
      return await uploadAvatar({ request, body, set })
    },
    {
      body: t.Object({
        file: t.File({ type: "image" }),
      }),
      ...DETAIL,
    },
  )
  .use(RoleMiddleWare)
  .get(
    "/bank",
    async ({ request, set }) => {
      const id = request.headers.get("userId") || ""
      const role = request.headers.get("role") || ""
      try {
        if (role !== "Seller") {
          set.status = 401
          return {
            status: "Unauthorized",
          }
        }
        const bank = await prisma.banks.findUnique({
          where: {
            author_id: id,
          },
        })
        if (!bank) {
          set.status = 404
          return {
            status: "Not Found",
          }
        }
        return {
          ...bank,
        }
      } catch (error) {
        console.log("🚀 ~ file: user.controller.ts:45 ~ .get ~ error:", error)
      }
    },
    {
      ...DETAIL,
    },
  )
  .post(
    "/bank",
    async ({ request, set, body }) => {
      const id = request.headers.get("userId") || ""
      const role = request.headers.get("role")
      const { account_no, acqId, account_name } = body
      if (role !== "Seller") {
        set.status = 401
        return {
          status: "Unauthorized",
        }
      }
      try {
        const bank = {
          author_id: id,
          account_no,
          acqId,
          account_name,
        }
        await prisma.banks.create({ data: bank })
        set.status = 201
        return {
          status: "Created",
        }
      } catch (error) {
        console.log("🚀 -----------------------------------------------🚀")
        console.log("🚀 ~ file: user.controller.ts:82 ~ error:", error)
        console.log("🚀 -----------------------------------------------🚀")
      }
    },
    {
      body: t.Object({
        account_no: t.String({ default: "1025871607" }),
        acqId: t.String({ default: "970436" }),
        account_name: t.String({ default: "PHAM MINH QUANG" }),
      }),
      detail: {
        tags: ["USER"],
        security: [{ BearerAuth: [] }],
        description: "Get info all VietNam of banks: https://api.vietqr.io/v2/banks",
      },
    },
  )

export default userController
