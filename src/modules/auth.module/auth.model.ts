import Elysia, { t } from "elysia"
enum ROLE {
  BUYER = "buyer",
  SELLER = "seller",
}
export const signInDto = t.Object({
  email: t.String({ format: "email", default: "buyer@example.com" }),
  password: t.String({ description: "This is password", default: "123456" }),
})

export const signUpDto = t.Partial(
  t.Object({
    email: t.String({ format: "email", default: "buyer@example.com" }),
    password: t.String({ description: "This is password", default: "123456" }),
    username: t.String({ default: "buyer" }),
    role: t.Enum(ROLE, { default: "buyer" }),
    arqId: t.String(),
    accountNo: t.String(),
  }),
)
export const refreshTokenDto = t.Object({
  refresh_token: t.String(),
})

const authModel = new Elysia().model({
  signIn: signInDto,
  signUp: signUpDto,
  refreshToken: refreshTokenDto,
})
export default authModel
