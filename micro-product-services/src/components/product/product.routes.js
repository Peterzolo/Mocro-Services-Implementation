import express from "express";
import { protectedAuth } from "../../../../authenticationMiddleWare.js";


const productRouter = express.Router();

import {
  addProduct,
  getAllProducts,
  getOneProduct,
  removeProduct,
  searchProductByTitle,
  updateAProduct,
} from "./product.controller.js";



productRouter.post("/create",protectedAuth,addProduct);
productRouter.get("/fetch-all", getAllProducts);
productRouter.get("/fetch-one/:id", getOneProduct);
productRouter.put(
  "/edit/:id",
  updateAProduct
);
productRouter.delete("/remove/:id",removeProduct);
productRouter.get("/search", searchProductByTitle);


export default productRouter;
