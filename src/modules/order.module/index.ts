import Elysia from "elysia"
import orderController from "./order.controller"

const oderModule = new Elysia()
oderModule.use(orderController)
export default oderModule
