import { Elysia } from "elysia"
import modules from "./modules"
import config from "config"

const app = new Elysia({ prefix: "/api/v1" })
  .use(config.Document)
  .get(
    "/",
    () => {
      return "Hello this is ie104"
    },
    { detail: { tags: ["App"] } },
  )
  .use(modules)
  .listen(Bun.env.SERVER_PORT || 3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
