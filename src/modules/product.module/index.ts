import Elysia from "elysia"
import productController from "./product.controller"

const productModule = new Elysia()
productModule.use(productController)
export default productModule
