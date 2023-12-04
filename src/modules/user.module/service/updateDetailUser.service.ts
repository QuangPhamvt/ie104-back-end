import { SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { banks, users } from "~/database/schema"
import { address } from "~/database/schema/address"

type updateDetailUserDto = {
  headers: Headers
  set: SetElysia
  body: {
    username: string
    address: {
      province: string
      district: string
      ward: string
    }
  }
}
export const updateDetailUser = async (props: updateDetailUserDto) => {
  const { headers, set, body } = props
  const user_id = headers.get("userId") || ""
  const {
    username,
    address: { province, district, ward },
  } = body
  try {
    await db.update(users).set({ username }).where(like(users.id, user_id))
    const [user] = await db.select().from(users).where(like(users.id, user_id))
    await db
      .update(address)
      .set({ province, district, ward })
      .where(like(address.id, user.address_id || ""))
    return {
      message: "oke",
    }
  } catch (error) {
    set.status = "Internal Server Error"
    console.log(error)
    return {
      message: "Internal Server Error",
    }
  }
}
