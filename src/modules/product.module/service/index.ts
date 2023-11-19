import { postSearchProductById } from "./postSearchProductById"
import { postSearchProduct } from "./postSearchProduct"
import { getCategories } from "./getCategories"
import { createProduct } from "./createProduct"
import { createCategories } from "./createCategories"

const productService = {
  postSearchProductById,
  postSearchProduct,
  getCategories,
  createProduct,
  createCategories,
}
export default productService
