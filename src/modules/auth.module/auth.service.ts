import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
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
    email: string
    password: string
    name: string
    role: "Buyer" | "Seller"
  }
}
interface refreshTokenDto extends Partial<authServiceDto> {
  body: {
    refresh_token: string
  }
}

interface profileDto extends Partial<authServiceDto> {
  body: {
    access_token: string
  }
}
//SIGN IN
export const signIn = async (context: signInDto) => {
  const { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, set, body } = context
  // Check User exist
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })
  if (!user) {
    set.status = "Bad Request"
    return {
      status: "Bad Request",
      message: "email or password is wrong!",
    }
  }
  // Compare Password
  const verifyPassword = await Bun.password.verify(
    body.password,
    user.password || "",
  )
  if (!verifyPassword) {
    set.status = "Bad Request"
    return {
      status: "Bad Request",
      message: "email or password is wrong!",
    }
  }
  const access_token = await JWT_ACCESS_TOKEN.sign({
    email: user.email,
    role: user.role,
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    email: user.email,
    role: user.role,
  })
  set.status = "Created"
  return {
    status: "Created",
    access_token,
    refresh_token,
  }
}

//SIGN UP
export const signUp = async (context: signUpDto) => {
  const { set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, body } = context
  // Check exist USER
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: body.email || "",
        },
        {
          name: body.name || "",
        },
      ],
    },
  })
  if (user) {
    set.status = "Bad Request"
    return {
      status: "Bad Request",
      message: "email or name is exist!",
    }
  }
  if (!body.password) {
    set.status = "Bad Request"
    return {
      status: "Bad Request",
      message: "Not have password!",
    }
  }
  // HASH Password
  const hashPassword = await Bun.password.hash(body.password, {
    algorithm: "bcrypt",
    cost: 4,
  })
  const access_token = await JWT_ACCESS_TOKEN.sign({
    email: body.email,
    role: body.role,
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    email: body.email,
    role: body.role,
  })
  await prisma.user.create({
    data: {
      ...body,
      password: hashPassword,
    },
  })
  set.status = "Created"
  return {
    status: "Created",
    access_token,
    refresh_token,
  }
}

//REFRESH TOKEN
export const refreshToken = async (context: refreshTokenDto) => {
  const { JWT_REFRESH_TOKEN, JWT_ACCESS_TOKEN, body, set } = context
  const { email, role } = await JWT_REFRESH_TOKEN.verify(body.refresh_token)
  if (!email || !role) {
    set.status = "Unauthorized"
    return {
      status: "Unauthorized",
      message: "Refresh Token is wrong",
    }
  }
  const access_token = await JWT_ACCESS_TOKEN.sign({ email, role })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({ email, role })
  return {
    access_token,
    refresh_token,
  }
}

//PROFILE
export const profile = async (context: profileDto) => {
  const { JWT_ACCESS_TOKEN, body, set } = context
  const { email } = await JWT_ACCESS_TOKEN.verify(body.access_token)
  if (!email) {
    set.status = "Forbidden"
    return {
      status: "Forbidden",
      message: "Accept token is Timeout",
    }
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  return {
    status: "OK",
    data: {
      user: {
        email: user?.email,
        name: user?.name,
        role: user?.role,
      },
    },
  }
}
