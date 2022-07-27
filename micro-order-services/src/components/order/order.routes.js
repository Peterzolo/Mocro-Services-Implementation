import express from "express";
import { protectedAuth } from "../../../../authenticationMiddleWare.js";

const orderRouter = express.Router();

import {
  // addOrder,
  getAllOrders,
  getOneOrder,
  removeOrder,
} from "./order.controller.js";
// orderRouter.post("/create", protectedAuth, addOrder);
orderRouter.get("/fetch-all", getAllOrders);
orderRouter.get("/fetch-one/:id", getOneOrder);  
orderRouter.delete("/remove/:id", removeOrder);

export default orderRouter;
