import Elysia from "elysia"
import { JWT_ACCESS_TOKEN, SetElysia } from "config"
import { like } from "drizzle-orm"
import db, { users } from "~/database/schema"

const authorization = new Elysia()
authorization
  .use(JWT_ACCESS_TOKEN)
  .onBeforeHandle(
    async ({ request, set, JWT_ACCESS_TOKEN }: { request: Request; set: SetElysia; JWT_ACCESS_TOKEN: any }) => {
      // Haven't Authorization
      if (!request.headers.get("authorization")) {
        set.status = 401
        return {
          message: "Authorization",
        }
      }
      const JWT = request.headers.get("authorization")?.split(" ")[1]

      // Wrong JWT
      const jwtVerify = await JWT_ACCESS_TOKEN.verify(JWT)
      if (!jwtVerify) {
        set.status = 403
        return {
          message: "Forbidden",
        }
      }

      // Wrong id
      const [user] = await db.select().from(users).where(like(users.id, jwtVerify.id))
      if (!user) {
        set.status = 401
        return "Unauthorized"
      }
      request.headers.set("userId", user.id)
    },
  )
export default authorization
