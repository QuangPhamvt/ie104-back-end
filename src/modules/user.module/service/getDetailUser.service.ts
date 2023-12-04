import { SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { banks, users } from "~/database/schema"
import { address } from "~/database/schema/address"

type getDetailUserDto = {
  headers: Headers
  set: SetElysia
}
export const getDetailUser = async (props: getDetailUserDto) => {
  const { headers, set } = props
  const user_id = headers.get("userId") || ""

  try {
    const [user] = await db
      .select({
        user: {
          username: users.username,
          role: users.role,
        },
        address: {
          province: address.province,
          district: address.district,
          ward: address.ward,
        },
        bank: {
          arqId: banks.acqId,
          account_name: banks.account_name,
          account_no: banks.account_no,
        },
      })
      .from(users)
      .innerJoin(address, like(users.address_id, address.id))
      .innerJoin(banks, like(banks.author_id, users.id))
      .where(like(users.id, user_id))
    return {
      message: "Oke",
      data: [user],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
