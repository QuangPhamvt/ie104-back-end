import { like } from "drizzle-orm"
import Elysia from "elysia"
import db, { users } from "~/database/schema"
const roleMiddleware = new Elysia()
roleMiddleware.onBeforeHandle(async ({ request, set }) => {
  const id = request.headers.get("userId") || ""
  try {
    const [user] = await db.select().from(users).where(like(users.id, id))
    request.headers.set("role", user?.role || "")
  } catch (error) {
    console.log("error:", error)
    set.status = 403
    return {
      message: "Forbidden",
    }
  }
})
export default roleMiddleware
