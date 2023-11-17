import { Elysia } from "elysia"
import modules from "./modules"
import config from "config"
import cors from "@elysiajs/cors"

const app = new Elysia({ prefix: "/api/v1" })
  .use(config.Document)
  .get(
    "/",
    () => {
      return "Hello this is ie104"
    },
    { detail: { tags: ["App"] } },
  )
  .onParse(({ request }, contentType) => {
    if (contentType === "image/jpeg") return request.text()
  })
  .use(
    cors({
      origin: true,
      allowedHeaders: "*",
      methods: "*",
      credentials: false,
    }),
  )
  .use(modules)
  .listen(Bun.env.SERVER_PORT || 3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api/v1/document`)
