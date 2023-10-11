import { prisma } from "config"

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
    username: string
    role: "Buyer" | "Seller"
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
//SIGN IN
export const signIn = async (context: signInDto) => {
  const { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, set, body } = context
  // Check User exist
  const user = await prisma.users.findUnique({
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
  const verifyPassword = await Bun.password.verify(body.password, user.password || "")
  if (!verifyPassword) {
    set.status = "Bad Request"
    return {
      status: "Bad Request",
      message: "email or password is wrong!",
    }
  }
  const access_token = await JWT_ACCESS_TOKEN.sign({
    id: user.id,
    role: user.role,
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    id: user.id,
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
  const user = await prisma.users.findFirst({
    where: {
      OR: [
        {
          email: body.email || "",
        },
        {
          username: body.username || "",
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
  const userNew = await prisma.users.create({
    data: {
      ...body,
      password: hashPassword,
    },
  })
  const access_token = await JWT_ACCESS_TOKEN.sign({
    id: userNew.id,
    role: userNew.role,
  })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({
    id: userNew.id,
    role: userNew.role,
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
  const { id, role } = await JWT_REFRESH_TOKEN.verify(body.refresh_token)
  if (!id || !role) {
    set.status = "Unauthorized"
    return {
      status: "Unauthorized",
      message: "Refresh Token is wrong",
    }
  }
  const access_token = await JWT_ACCESS_TOKEN.sign({ id, role })
  const refresh_token = await JWT_REFRESH_TOKEN.sign({ id, role })
  return {
    access_token,
    refresh_token,
  }
}

//PROFILE
export const profile = async (context: profileDto) => {
  try {
    const { request, JWT_ACCESS_TOKEN, set } = context
    const user = await prisma.users.findUnique({
      where: {
        id: request.headers.get("userId") || undefined,
      },
    })
    return {
      status: "OK",
      data: {
        user: {
          email: user?.email,
          name: user?.username,
          role: user?.role,
        },
      },
    }
  } catch (error) {}
}
