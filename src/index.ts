import { Elysia } from "elysia"
import modules from "./modules"
import config from "config"
import cors from "@elysiajs/cors"

const app = new Elysia({ prefix: "/api/v1" })
  .use(config.Document)
  // .onParse(({ request }, contentType) => {
  //   if (contentType === "image/jpeg") return request.text()
  // })
  .use(cors())
  .use(modules)
  .listen(process.env.SERVER_PORT || 3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api/v1/document`)
