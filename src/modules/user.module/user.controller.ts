import swagger from "@elysiajs/swagger"
import Elysia, { t } from "elysia"
import { getObject, upload } from "../../../aws/s3"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "config"
import authorization from "~/middlewares/authorization"
import { getAvatar, uploadAvatar } from "./user.service"
import { RoleMiddleWare } from "~/middlewares"
import UserModel from "./user.model"
import userService from "./service"

const DETAIL = {
  detail: {
    tags: ["USER"],
    security: [{ BearerAuth: [] }],
  },
}
const userController = new Elysia()
userController
  .use(UserModel)
  .use(authorization)
  .get(
    "/",
    ({ request: { headers }, set }) => {
      return userService.getDetailUser({ headers, set })
    },
    {
      response: "getDetailUserResponse",
      detail: {
        tags: ["USER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/",
    ({ request: { headers }, set, body }) => {
      return userService.updateDetailUser({ headers, set, body })
    },
    {
      body: "updateDetailBody",
      response: "updateDetailResponse",
      detail: {
        tags: ["USER"],
        security: [{ BearerAuth: [] }],
      },
    },
  )

export default userController
