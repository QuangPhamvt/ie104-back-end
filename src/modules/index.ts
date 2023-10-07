import Elysia from "elysia"
import { default as AUTH } from "./auth.module"
import { default as USER } from "./user.module"

const modules = new Elysia().use(AUTH).use(USER)
export default modules
