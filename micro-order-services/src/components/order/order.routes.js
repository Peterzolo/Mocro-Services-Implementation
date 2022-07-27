import express from "express";
// import upload from "../../utils/multer.js"

const orderRouter = express.Router();

import {
  addOrder,
  getAllOrders,
  getOneOrder,
  removeOrder,
  updateAnOrder,
} from "./order.controller.js";

orderRouter.post("/create", addOrder);
orderRouter.get("/fetch-all", getAllOrders);
orderRouter.get("/fetch-one/:id", getOneOrder);
orderRouter.put(
  "/edit/:id",

  updateAnOrder
);
orderRouter.delete("/remove/:id", removeOrder);

export default orderRouter;
