import swagger from "@elysiajs/swagger"
import Elysia, { t } from "elysia"
import { getObject, upload } from "../../../aws/s3"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "config"
import authorization from "~/middlewares/authorization"
import { getAvatar, uploadAvatar } from "./user.service"

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
    ({ request }) => {
      return getAvatar(request)
    },
    {
      ...DETAIL,
    },
  )
  .post(
    "/avatar/upload",
    ({ request, body, set }) => {
      return uploadAvatar({ request, body, set })
    },
    {
      body: t.Object({
        file: t.File({ type: "image" }),
      }),
      ...DETAIL,
    },
  )

export default userController
