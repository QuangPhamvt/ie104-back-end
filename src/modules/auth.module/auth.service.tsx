import { JWT_REFRESH_TOKEN, SetElysia } from "config"
import { like, or } from "drizzle-orm"
import db, { banks, users } from "~/database/schema"
import { address } from "~/database/schema/address"
import { ARQ_ID } from "~/utilities"
import { v4 as uuidv4 } from "uuid"
import { Resend } from "resend"
import WelcomeEmail from "../../../emails"
import React from "react"

const reSend = new Resend(process.env.RESEND_KEY || "")
const urlClient = process.env.URL_CLIENT
interface authServiceDto {
  set: any
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
  JWT_SIGNUP_TOKEN: any
  body: {}
}
interface signInDto extends Partial<authServiceDto> {
  body: {
    email: string
    password: string
  }
}
interface signUpDto extends Partial<authServiceDto> {
  body: {
    email?: string
    password?: string
    username?: string
    role?: "buyer" | "seller"
    province?: string
    district?: string
    ward?: string
    acqId?: string
    accountNo?: string
    accountName?: string
  }
}
interface signUpVerifyDto extends Partial<authServiceDto> {
  body: {
    token: string
  }
}
interface refreshTokenDto extends Partial<authServiceDto> {
  body: {
    refresh_token: string
  }
}

interface profileDto extends Partial<authServiceDto> {
  request: Request
}
interface checkAccountDto {
  set: SetElysia
  acqId: string
  accountNo: string
}

//SIGN IN
export const signIn = async (context: signInDto) => {
  const {
    JWT_ACCESS_TOKEN,
    JWT_REFRESH_TOKEN,
    set,
    body: { email, password },
  } = context
  // Check User exist
  const [user] = await db.select().from(users).where(like(users.email, email))
  const [Address] = await db
    .select()
    .from(address)
    .where(like(address.id, user.address_id || ""))
  if (!user) {
    set.status = 400
    return {
      message: "email or password is wrong!",
    }
  }
  // Compare Password
  const verifyPassword = await Bun.password.verify(password, user.password || "")
  if (!verifyPassword) {
    set.status = 400
    return {
      message: "email or password is wrong!",
    }
  }
  const access_token = await JWT_ACCESS_TOKEN.sign({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    province: Address.province,
    district: Address.district,
    ward: Address.ward,
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    province: Address.province,
    district: Address.district,
    ward: Address.ward,
  })
  set.status = "Created"
  return {
    message: "Created",
    data: {
      access_token,
      refresh_token,
    },
  }
}

//SIGN UP
export const signUp = async (context: signUpDto) => {
  try {
    const {
      set,
      JWT_SIGNUP_TOKEN,
      body: { email, username, password, role, acqId, accountNo, accountName, province, district, ward },
    } = context
    if (!email || !username) {
      set.status = 400
      return {
        message: "Not have username or email",
      }
    }

    const [user] = await db
      .select()
      .from(users)
      .where(or(like(users.email, email), like(users.username, username)))
    if (user) {
      set.status = "Bad Request"
      return {
        message: "email or name is exist!",
      }
    }
    if (!password) {
      set.status = 400
      return {
        message: "Bad Request",
      }
    }
    // HASH Password
    const hashPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4,
    })
    const token = await JWT_SIGNUP_TOKEN.sign({
      email: email,
      username: username,
      password: hashPassword,
      role: role,
      province,
      district,
      ward,
    })

    if (role === "seller") {
      if (!acqId || !accountNo || !accountName) {
        set.status = 400
        return {
          message: "Not have bin or account",
        }
      }
      const token = await JWT_SIGNUP_TOKEN.sign({
        email: email,
        username: username,
        password: hashPassword,
        role: role,
        province,
        district,
        ward,
        acqId,
        accountNo,
        accountName,
      })
      await reSend.emails.send({
        from: "QuangPham <BunShop@customafk.com>",
        to: [`${email}`],
        subject: `Confirm your BunShop Account`,
        react: <WelcomeEmail userFirstName={email} url={`${urlClient}?token=${token}`} />,
      })
      return {
        message: "Please check your email",
      }
    }
    set.status = 200
    await reSend.emails.send({
      from: "Name <BunShop@customafk.com>",
      to: [`${email}`],
      subject: `Confirm your BunShop Account`,
      react: <WelcomeEmail userFirstName={email} url={`${urlClient}?token=${token}`} />,
    })
    return {
      message: "Please check your email",
    }
  } catch (error) {
    console.log(error)
    return {
      message: "Something wrong",
    }
  }
}

export const signUpVerify = async <T extends signUpVerifyDto>(props: T) => {
  const { set, JWT_SIGNUP_TOKEN, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, body } = props
  const { token } = body
  try {
    const jwtVerify = await JWT_SIGNUP_TOKEN.verify(token)
    if (!jwtVerify) {
      set.status = 403
      return {
        message: "forbidden",
        data: {
          access_token: "",
          refresh_token: "",
        },
      }
    }
    const { email, username, password, role, province, district, ward, acqId, accountNo, accountName } = jwtVerify
    const [user] = await db
      .select()
      .from(users)
      .where(or(like(users.email, email), like(users.username, username)))
    if (user) {
      set.status = 403
      return {
        message: "forbidden",
        data: {
          access_token: "",
          refresh_token: "",
        },
      }
    }

    if (jwtVerify.role === "buyer") {
      const userUuid = uuidv4()
      const addressUuid = uuidv4()
      await db.insert(users).values({ id: userUuid, email, username, password, role, address_id: addressUuid })
      await db.insert(address).values({ id: addressUuid, province, district, ward })
      const [user] = await db.select().from(users).where(like(users.email, email))
      const access_token = await JWT_ACCESS_TOKEN.sign({
        id: user.id,
        email,
        username,
        role,
        province,
        district,
        ward,
      })
      const refresh_token = await JWT_REFRESH_TOKEN.sign({
        id: user.id,
        email,
        username,
        role,
        province,
        district,
        ward,
      })
      set.status = 201
      return {
        message: "Created",
        data: {
          access_token,
          refresh_token,
        },
      }
    }

    if (jwtVerify.role === "seller") {
      const userUuid = uuidv4()
      const addressUuid = uuidv4()
      const bankUuid = uuidv4()
      await db.insert(users).values({ id: userUuid, email, username, password, role, address_id: addressUuid })
      await db.insert(address).values({ id: addressUuid, province, district, ward })
      await db
        .insert(banks)
        .values({ id: bankUuid, author_id: userUuid, acqId, account_no: accountNo, account_name: accountName })
      const [user] = await db.select().from(users).where(like(users.email, email))
      const access_token = await JWT_ACCESS_TOKEN.sign({
        id: user.id,
        email,
        username,
        role,
        province,
        district,
        ward,
      })
      const refresh_token = await JWT_REFRESH_TOKEN.sign({
        id: user.id,
        email,
        username,
        role,
        province,
        district,
        ward,
      })
      set.status = 201
      return {
        message: "Created",
        data: {
          access_token,
          refresh_token,
        },
      }
    }

    set.status = 404
    return {
      message: "Bad request",
      data: {
        access_token: "",
        refresh_token: "",
      },
    }
  } catch (error) {
    set.status = "Internal Server Error"
    console.log(error)
    return {
      message: "Internal Server Error",
      data: {
        access_token: "",
        refresh_token: "",
      },
    }
  }
}

//REFRESH TOKEN
export const refreshToken = async (context: refreshTokenDto) => {
  const { JWT_REFRESH_TOKEN, JWT_ACCESS_TOKEN, body, set } = context
  const { id, username, email, role } = await JWT_REFRESH_TOKEN.verify(body.refresh_token)
  if (!id || !role || !username || !email) {
    set.status = "Unauthorized"
    return {
      message: "Refresh Token is wrong",
    }
  }
  set.status = 200
  const access_token = await JWT_ACCESS_TOKEN.sign({ id, email, username, role })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({ id, email, username, role })
  return {
    message: "Created",
    data: {
      access_token,
      refresh_token,
    },
  }
}

//PROFILE
export const profile = async (context: profileDto) => {
  let detailBank
  try {
    const { request } = context
    const id = request.headers.get("userId") || ""
    const [user] = await db.select().from(users).where(like(users.id, id))
    if (user.role === "seller") {
      detailBank = await db.select().from(banks).where(like(banks.author_id, user.id))
      return {
        message: "Ok",
        data: {
          user: {
            email: user.email || "",
            name: user.username || "",
            role: user.role || "seller",
          },
          bank: {
            ...detailBank[0],
          },
        },
      }
    }
    return {
      message: "OK",
      data: {
        user: {
          email: user.email || "",
          name: user.username || "",
          role: user.role || "",
        },
      },
    }
  } catch (error) {
    console.log(error)
    return {
      message: "Internal Server Error",
    }
  }
}

// CHECK BANK ACCOUNT
export const checkAccount = async <TContext extends checkAccountDto>(context: TContext) => {
  const { set, acqId, accountNo } = context
  try {
    let response: any = await fetch("https://api.vietqr.io/v2/lookup", {
      method: "POST",
      headers: {
        "x-client-id": process.env.CLIENT_ID || "",
        "x-api-key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bin: +acqId,
        accountNumber: +accountNo,
      }),
    })
    response = await response.json()
    if (response?.code !== "00") {
      set.status = 400
      return {
        message: "Something wrong with account",
      }
    }
    return {
      message: "Ok",
      data: {
        ...response.data,
        ...ARQ_ID[acqId],
      },
    }
  } catch (error) {
    set.status = 500
    return {
      message: "Internal Server Error",
    }
  }
}
