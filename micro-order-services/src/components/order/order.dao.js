import Order from "./order.model.js";

export const saveOrderPayload = async (args) => {
  const payload = await Order.create(args);
  return payload;
};

export const fetchAllOrders = async () => {
  const order = await Order.find({ status: "active" }).populate(
    "user product",
    "-password"
  );
  return order;
};

export const findOrderById = async (id) => {
  const order = await Order.findById({ _id: id, status: "active" }).populate(
    "user",
    "-password"
  );
  return order;
};

// export const findOneOrder = async(id) =>{
//   const Order = await Order.findById({_id : id})
//   return Order
// }

export const findOrderByName = async (query) => {
  const order = await Order.findOne(query).populate("user", "-password");
  return order;
};

export const updateOrder = async (id, OrderObj) => {
  const order = await Order.findByIdAndUpdate(
    { _id: id },
    { $set: OrderObj },
    { new: true }
  );
  return order;
};

export const deleteOrder = async (id, userId) => {
  const order = await Order.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return order;
};

export const findOrderOwnerById = async (id) => {
  const order = await Order.find({ status: "active", user: id }).populate(
    "user",
    "-password"
  );
  return order;
};
