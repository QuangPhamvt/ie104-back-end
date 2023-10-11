import { PrismaClient } from "@prisma/client"
import { JWT_ACCESS_TOKEN } from "config"
import Elysia from "elysia"

const prisma = new PrismaClient()
const authorization = new Elysia()
authorization.use(JWT_ACCESS_TOKEN).onBeforeHandle(async ({ request, set, JWT_ACCESS_TOKEN }) => {
  // Haven't Authorization
  if (!request.headers.get("authorization")) {
    set.status = 401
    return "Unauthorized"
  }
  const JWT = request.headers.get("authorization")?.split(" ")[1]

  // Wrong JWT
  const user = await JWT_ACCESS_TOKEN.verify(JWT)
  if (!user) {
    set.status = 401
    return "Access token expired"
  }

  // Wrong id
  if (
    !(await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    }))
  ) {
    set.status = 401
    return "Unauthorized"
  }
  request.headers.set("userId", user.id)
})
export default authorization
