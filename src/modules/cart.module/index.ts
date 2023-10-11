import Elysia from "elysia"
import cartController from "./cart.controller"

const cartModule = new Elysia()
cartModule.use(cartController)
export default cartModule
