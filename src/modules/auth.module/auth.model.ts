import Elysia, { t } from "elysia"
enum ROLE {
  BUYER = "Buyer",
  SELLER = "Seller",
}
export const signInDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ description: "This is password" }),
})

export const signUpDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
  username: t.String(),
  role: t.Enum(ROLE, { default: "Buyer" }),
})
export const refreshTokenDto = t.Object({
  refresh_token: t.String(),
})

const authModel = new Elysia().model({
  signIn: signInDto,
  signUp: signUpDto,
  refreshToken: refreshTokenDto,
})
export default authModel
