import Elysia from "elysia"
import { default as AUTH } from "./auth.module"

const modules = new Elysia().use(AUTH)
export default modules
