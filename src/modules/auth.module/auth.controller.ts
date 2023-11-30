import Elysia from "elysia"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "config"
import authModel from "~/modules/auth.module/auth.model"
import { checkAccount, profile, refreshToken, signIn, signUp, signUpVerify } from "./auth.service"
import authorization from "~/middlewares/authorization"
import { JWT_SIGNUP_TOKEN } from "~/config/jwt.token"

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
  .use(JWT_SIGNUP_TOKEN)
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
      const { body, set, JWT_SIGNUP_TOKEN } = context
      return signUp({ set, body, JWT_SIGNUP_TOKEN })
    },
    {
      body: "signUp",
      response: "signUpResponse",
      ...DETAIL,
    },
  )
  .post(
    "/sign-up/verify",
    ({ body, set, JWT_SIGNUP_TOKEN, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) => {
      return signUpVerify({ body, set, JWT_SIGNUP_TOKEN, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN })
    },
    {
      body: "signUpVerifyBody",
      response: "signUpVerifyResponse",
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
