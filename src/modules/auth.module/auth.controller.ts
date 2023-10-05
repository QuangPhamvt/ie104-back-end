import Elysia, { t } from "elysia"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "config"
import authModel from "~/modules/auth.module/auth.model"
import { profile, refreshToken, signIn, signUp } from "./auth.service"

const authController = new Elysia()
const DETAIL = {
  detail: {
    tags: ["Auth"],
  },
}
authController
  .use(authModel)
  .use(JWT_ACCESS_TOKEN)
  .use(JWT_REFRESH_TOKEN)
  .post(
    "/sign-in",
    (context) => {
      const { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, set, body } = context
      return signIn({ JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, set, body })
    },
    {
      body: "signIn",
      ...DETAIL,
      error() {
        return {
          status: "Bad Request",
          message: "Something wrong with email",
        }
      },
    },
  )
  .post(
    "/sign-up",
    (context) => {
      const { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, body, set } = context
      return signUp({ JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, set, body })
    },
    {
      body: "signUp",
      ...DETAIL,
    },
  )
  .post(
    "/refresh-token",
    (context) => {
      const { JWT_REFRESH_TOKEN, JWT_ACCESS_TOKEN, body, set } = context
      return refreshToken({ JWT_REFRESH_TOKEN, JWT_ACCESS_TOKEN, body, set })
    },
    {
      body: "refreshToken",
      ...DETAIL,
    },
  )
  .post(
    "/profile",
    (context) => {
      const { JWT_ACCESS_TOKEN, body, set } = context
      return profile({ JWT_ACCESS_TOKEN, body, set })
    },
    {
      body: "profile",
      ...DETAIL,
    },
  )

export default authController
