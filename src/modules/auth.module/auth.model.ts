import Elysia, { t } from "elysia"
enum ROLE {
  BUYER = "Buyer",
  SELLER = "Seller",
}
export const signInDto = t.Object({
  email: t.String({ format: "email", default: "seller@example.com" }),
  password: t.String({ description: "This is password", default: "123456" }),
})

export const signUpDto = t.Object({
  email: t.String({ format: "email", default: "seller@example.com" }),
  password: t.String({ description: "This is password", default: "123456" }),
  username: t.String({ default: "seller" }),
  role: t.Enum(ROLE, { default: "Seller" }),
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
