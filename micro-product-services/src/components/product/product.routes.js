import express from "express";


const productRouter = express.Router();

import {
  addProduct,
  getAllProducts,
  getOneProduct,
  removeProduct,
  searchProductByTitle,
  updateAProduct,
} from "./product.controller.js";
import { authorizedAndAdmin, protect } from "../../middleware/auth2.js";


productRouter.post("/create", addProduct);
productRouter.get("/fetch-all", getAllProducts);
productRouter.get("/fetch-one/:id", getOneProduct);
productRouter.put(
  "/edit/:id",

  authorizedAndAdmin,
  updateAProduct
);
productRouter.delete("/remove/:id", authorizedAndAdmin, removeProduct);
productRouter.get("/search", searchProductByTitle);


export default productRouter;
