import Elysia from "elysia"
import userController from "./user.controller"

const userModule = new Elysia()
userModule.use(userController)
export default userModule
