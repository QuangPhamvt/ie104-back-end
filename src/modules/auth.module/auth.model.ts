import Elysia, { t } from "elysia"
enum ROLE {
  BUYER = "buyer",
  SELLER = "seller",
}
export const signInDto = t.Object({
  email: t.String({ format: "email", default: "seller@example.com" }),
  password: t.String({ description: "This is password", default: "123456" }),
})

export const signInResponseDto = t.Partial(
  t.Object({
    message: t.String(),
    data: t.Object({
      access_token: t.String(),
      refresh_token: t.String(),
    }),
  }),
)
export const signUpDto = t.Partial(
  t.Object({
    email: t.String({ format: "email", default: "buyer@example.com" }),
    password: t.String({ description: "This is password", default: "123456" }),
    username: t.String({ default: "seller" }),
    role: t.Enum(ROLE, { default: "seller" }),
    province: t.String({ default: "Thành phố Hồ Chí Minh" }),
    district: t.String({ default: "Thành phố Thủ Đức" }),
    ward: t.String({ default: "Phường Hiệp Bình Chánh" }),
    acqId: t.String({ description: "Link to get acqId bank: https://api.vietqr.io/v2/banks", default: "970436" }),
    accountNo: t.String({ default: "1025871607" }),
    accountName: t.String({ default: "Pham Minh Quang" }),
  }),
)
export const signUpResponseDto = t.Partial(
  t.Object({
    message: t.String(),
  }),
)
export const refreshTokenDto = t.Object({
  refresh_token: t.String(),
})
export const refreshTokenResponseDto = t.Partial(
  t.Object({
    message: t.String(),
    data: t.Object({
      access_token: t.String(),
      refresh_token: t.String(),
    }),
  }),
)
export const checkAccountDto = t.Object({
  acqId: t.String({ default: "970415" }),
  accountNo: t.String({ default: "113366668888" }),
})
export const checkAccountResponseDto = t.Partial(
  t.Object({
    message: t.String(),
    data: t.Object({
      accountName: t.String(),
      name: t.String(),
      shortName: t.String(),
      logo: t.String(),
    }),
  }),
)
export const profileResponseDto = t.Object({
  message: t.String(),
  data: t.Object({
    user: t.Object({
      email: t.String(),
      name: t.String(),
      role: t.Enum(ROLE),
    }),
    bank: t.Object({
      id: t.String(),
      author_id: t.String(),
      acqId: t.String(),
      account_name: t.String(),
      account_no: t.String(),
    }),
  }),
})
const signUpVerifyBodyDto = t.Object({
  token: t.String(),
})
const signUpVerifyResponseDto = t.Object({
  message: t.String(),
  data: t.Object({
    access_token: t.String(),
    refresh_token: t.String(),
  }),
})

const authModel = new Elysia().model({
  signIn: signInDto,
  signInResponse: signInResponseDto,

  signUp: signUpDto,
  signUpResponse: signUpResponseDto,

  signUpVerifyBody: signUpVerifyBodyDto,
  signUpVerifyResponse: signUpVerifyResponseDto,

  refreshToken: refreshTokenDto,
  refreshTokenResponse: refreshTokenResponseDto,

  checkAccount: checkAccountDto,
  checkAccountResponse: checkAccountResponseDto,

  profileResponse: profileResponseDto,
})
export default authModel
