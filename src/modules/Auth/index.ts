import Elysia from "elysia"

const authModule = new Elysia({ prefix: "/auth" }).get(
  "/",
  () => {
    return "Hello world"
  },
  { detail: { tags: ["Auth"] } },
)
export default authModule
