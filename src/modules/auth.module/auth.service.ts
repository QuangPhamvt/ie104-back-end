import { SetElysia } from "config"
import { like, or } from "drizzle-orm"
import db, { banks, users } from "~/database/schema"
import { ARQ_ID } from "~/utilities"

interface authServiceDto {
  set: any
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
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
    arqId?: string
    accountNo?: string
    accountName?: string
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
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
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
  const {
    set,
    JWT_ACCESS_TOKEN,
    JWT_REFRESH_TOKEN,
    body: { email, username, password, role, arqId, accountNo, accountName },
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
  // INSERT USER
  await db.insert(users).values({ email, username, password: hashPassword, role })
  const [newUser] = await db.select().from(users).where(like(users.email, email))
  // CREATE TOKEN
  const access_token = await JWT_ACCESS_TOKEN.sign({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
  })

  if (role === "seller") {
    if (!arqId || !accountNo || !accountName) {
      set.status = 400
      return {
        message: "Not have bin or account",
      }
    }
    await db.insert(banks).values({
      author_id: newUser.id,
      acqId: arqId,
      account_name: accountName,
      account_no: accountNo,
    })
  }
  set.status = "Created"
  return {
    message: "Created",
    data: {
      access_token,
      refresh_token,
    },
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
