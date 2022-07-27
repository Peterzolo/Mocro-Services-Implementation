


import { findOrderById, findOrderByName, saveOrderPayload } from "./order.dao.js";
import ApiError from "../../error/ApiError.js";

export const createOrderService = async ({
  products,
  user,
  total_price,
  status,
}) => {
  const orderObject = {
    products,
    user,
    total_price,
    status,
  };

  // const orderExists = await findorderByName({ title });

  // if (orderExists) {
  //   throw ApiError.alreadyExists({
  //     message: "order with this title has already been created",
  //   });
  // }

  const order = await saveOrderPayload(orderObject); 
  return {
    products: order.products,
    user: order.user,
    total_price : order.total_price,
    status: order.status,
  };
};

