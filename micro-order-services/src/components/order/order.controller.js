import mongoose from "mongoose";
import {
  deleteOrder,
  fetchAllOrders,
  findOrderById,
  findOrderOwnerById,
  saveOrderPayload,
  updateOrder,
} from "./order.dao.js";
import ApiError from "../../error/ApiError.js";
import amqp from "amqplib";
import Order from "./order.model.js";

let connection;
let channel;
// let order;
// import { createOrder } from "./order.service.js";

// export const addOrder = async (req, res) => {
//   try {
//     const {
//       products,
//       user,
//       total_price,
//       status,
//     } = req.body;
//     const userId = req.user;
//     const findUser = userId;
//     const dataObject = {
//       products,
//       user,
//       total_price,
//       status,
//     };
//     const orderData = await createOrder(dataObject);
//     res.status(200).json({
//       success: true,
//       message: "order successfully created",
//       result: orderData,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createOrder = (products, userEmail) => {
  let total = 0;
  for (let t = 0; t < products.length; ++t) {
    total += products[t].price;
  }
  
  const newOrder = new Order({
    products,
    user: userEmail,
    total_price: total,
  });
  newOrder.save();
  return newOrder;
};

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}
connect().then(() => {
  channel.consume("ORDER", (data) => {
    console.log("Consuming ORDER service");
    const { products, userEmail } = JSON.parse(data.content);
    const newOrder = createOrder(products, userEmail);
    channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
  });
});

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await fetchAllOrders();
    if (!allOrders.length) {
      throw ApiError.notFound("No order Found");
    }
    res.status(200).json({
      orderCount: allOrders.length,
      success: true,
      message: "Successfully fetched all orders",
      result: allOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const findOrder = await findOrderById(id);
    if (findOrder) {
      const order = findOrder;
      res.status(200).send({
        Success: true,
        message: "order successfully fetched",
        result: order,
      });
    } else {
      res.status(401).send({ message: "order Not Found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error has occured" });
  }
};

export const removeOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const findorder = await findorderById(id);

    if (findorder.user._id.toString() === userId._id) {
      if (findorder.status === "inactive") {
        throw ApiError.notFound({ message: "order not available" });
      }
      await cloudinary.uploader.destroy(findorder.cloudinary_id);

      const query = id;

      let deletedorder = await deleteorder(query);

      if (!deletedorder) {
        throw ApiError.notFound({ message: "Could not delete order" });
      }
      return res.status(200).send({
        success: true,
        message: "order deleted successfully",
        result: deletedorder,
      });
    } else {
      res.status(403).send({ message: "Not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
