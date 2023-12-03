import Elysia, { t } from "elysia"
enum ROLE {
  BUYER = "buyer",
  SELLER = "seller",
}

const getDetailUserResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      user: t.Object({
        username: t.String(),
        role: t.Union([t.Literal("buyer"), t.Literal("seller"), t.Null()]),
      }),
      address: t.Object({
        province: t.String(),
        district: t.String(),
        ward: t.String(),
      }),
      bank: t.Object({
        arqId: t.String(),
        account_name: t.String(),
        account_no: t.String(),
      }),
    }),
  ),
})

const updateDetailBodyDto = t.Object({
  username: t.String(),
  address: t.Object({
    province: t.String(),
    district: t.String(),
    ward: t.String(),
  }),
})
const updateDetailResponseDto = t.Object({
  message: t.String(),
})

const UserModel = new Elysia().model({
  getDetailUserResponse: getDetailUserResponseDto,

  updateDetailBody: updateDetailBodyDto,
  updateDetailResponse: updateDetailResponseDto,
})
export default UserModel
