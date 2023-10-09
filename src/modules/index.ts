import Elysia from "elysia"
import { default as AUTH } from "./auth.module"
import { default as USER } from "./user.module"

const modules = new Elysia().group("/auth", (app) => app.use(AUTH)).group("/user", (app) => app.use(USER))

export default modules
