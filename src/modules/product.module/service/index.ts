import { postSearchProductById } from "./postSearchProductById"
import { postSearchProduct } from "./postSearchProduct"
import { getCategories } from "./getCategories"
import { createProduct } from "./createProduct"
import { createCategories } from "./createCategories"
import postFindProductByCategory from "./postFindProductByCategory"

const productService = {
  postSearchProductById,
  postSearchProduct,
  getCategories,
  createProduct,
  createCategories,
  postFindProductByCategory,
}
export default productService
