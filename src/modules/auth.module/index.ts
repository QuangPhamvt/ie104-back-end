import Elysia from "elysia"
import authController from "./auth.controller"

const authModule = new Elysia()
authModule.use(authController)

export default authModule
