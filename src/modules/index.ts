import Elysia from "elysia"
import { default as AUTH } from "./auth.module"
import { default as USER } from "./user.module"
import { default as CART } from "./cart.module"
import { default as ORDER } from "./order.module"
import { default as PRODUCT } from "./product.module"

const modules = new Elysia()
  .group("/auth", (app) => app.use(AUTH))
  .group("/user", (app) => app.use(USER))
  .group("/cart", (app) => app.use(CART))
  .group("/order", (app) => app.use(ORDER))
  .group("/product", (app) => app.use(PRODUCT))

export default modules
