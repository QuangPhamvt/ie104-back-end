import Elysia from "elysia"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "config"
import authModel from "~/modules/auth.module/auth.model"
import { checkAccount, profile, refreshToken, signIn, signUp } from "./auth.service"
import authorization from "~/middlewares/authorization"

const authController = new Elysia()
const DETAIL = {
  detail: {
    tags: ["AUTH"],
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
      response: "signInResponse",
      detail: {
        tags: ["AUTH"],
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
      response: "signUpResponse",
      ...DETAIL,
    },
  )
  .post(
    "/check-account",
    (context) => {
      const {
        set,
        body: { acqId, accountNo },
      } = context
      return checkAccount({ set, acqId, accountNo })
    },
    {
      body: "checkAccount",
      response: "checkAccountResponse",
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
      response: "refreshTokenResponse",
      ...DETAIL,
    },
  )
  .use(authorization)
  .get(
    "/profile",
    (context) => {
      const { request, JWT_ACCESS_TOKEN, set } = context
      return profile({ request, JWT_ACCESS_TOKEN, set })
    },
    {
      detail: {
        tags: ["AUTH"],
        security: [{ BearerAuth: [] }],
      },
    },
  )

export default authController
