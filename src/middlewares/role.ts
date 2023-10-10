import { prisma } from "config"
import Elysia from "elysia"
const roleMiddleware = new Elysia()
roleMiddleware.onBeforeHandle(async ({ request }) => {
  const id = request.headers.get("userId") || ""
  try {
    const user = await prisma.users.findUnique({ where: { id } })
    request.headers.set("role", user?.role || "")
  } catch (error) {
    console.log("🚀 -------------------------------------------------------------------🚀")
    console.log("🚀 ~ file: role.ts:9 ~ roleMiddleware.onBeforeHandle ~ error:", error)
    console.log("🚀 -------------------------------------------------------------------🚀")
  }
})
export default roleMiddleware
