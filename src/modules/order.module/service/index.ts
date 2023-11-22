import { postFindOrderByCart } from "./postFindOrderByCart"
import { postCreateOrder } from "./postCreateOrder"
import { findOrderList } from "./findOrderList"
import { updateStatusOrder } from "./updateStatusOrder"
const orderService = {
  updateStatusOrder,
  postFindOrderByCart,
  postCreateOrder,
  findOrderList,
}

export default orderService
