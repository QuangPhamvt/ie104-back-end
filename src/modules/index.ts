import Elysia from "elysia"
import { default as AUTH } from "./auth.module"
import { default as USER } from "./user.module"
import { default as PRODUCT } from "./product.module"

const modules = new Elysia()
  .group("/auth", (app) => app.use(AUTH))
  .group("/user", (app) => app.use(USER))
  .group("/product", (app) => app.use(PRODUCT))

export default modules
