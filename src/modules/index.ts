import Elysia from "elysia"
import { default as AUTH } from "./Auth"

const modules = new Elysia().use(AUTH)
export default modules
