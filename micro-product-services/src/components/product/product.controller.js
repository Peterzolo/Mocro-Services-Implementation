import mongoose from "mongoose"; 
import {
  deleteProduct,
  fetchAllProducts,
  findProductById,
  findProductOwnerById,
  updateProduct,
} from "./product.dao.js";
import ApiError from "../../error/ApiError.js";

import { createProduct } from "./product.service.js";
import cloudinary from "../../utils/cloudinary.js";



export const addProduct = async (req, res) => {
  try {
    const {
      description,
      price,
      name,
      image,
      status,
    } = req.body;
    const userId = req.user;
    const findUser = userId;
    // if (user === findUser._id.toString() || findUser.isAdmin === true) {
    // const result = await cloudinary.uploader.upload(req.file.path);
    const dataObject = {
      description,
      price,
      name,
      image,
      status,
    };
    const productData = await createProduct(dataObject);
    res.status(200).json({
      success: true,
      message: "product successfully created",
      result: productData,
    });
    // } else {
    //   res.send({ message: "You are not authorized" });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await fetchAllProducts();
    if (!allProducts.length) {
      throw ApiError.notFound("No product Found");
    }
    res.status(200).json({
      productCount: allProducts.length,
      success: true,
      message: "Successfully fetched all products",
      result: allProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const findProduct = await findProductById(id);
    if (findProduct) {
      const product = findProduct;
      res.status(200).send({
        Success: true,
        message: "product successfully fetched",
        result: product,
      });
    } else {
      res.status(401).send({ message: "product Not Found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error has occured" });
  }
};

export const updateAProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid product  id" });
    }

    const product = await findProductById(id);

    if (product.user._id.toString() === user._id || user.isAdmin === true) {
      if (product.status === "inactive") {
        throw ApiError.notFound({ message: "product not found" });
      }

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(product.cloudinary_id);
      // Upload image to cloudinary
      let result;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        price: req.body.price || product.price,
        description: req.body.description || product.description,
        name: req.body.name || product.name,
        image: result?.secure_url || product.image,
        cloudinary_id: result?.public_id || product.cloudinary_id,
      };

      let editedProduct = await updateProduct(id, data);

      if (!editedProduct) {
        throw ApiError.notFound({ message: "product not available" });
      }
      return res.status(200).send({
        message: "product updated successfully",
        content: editedProduct,
        success: true,
      });
    } else {
      res.status(403).send({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const findProduct = await findProductById(id);



    if (findProduct.user._id.toString() === userId._id) {
      if (findProduct.status === "inactive") {
        throw ApiError.notFound({ message: "product not available" });
      }
      await cloudinary.uploader.destroy(findProduct.cloudinary_id);

      const query = id;

      let deletedProduct = await deleteProduct(query);

      if (!deletedProduct) {
        throw ApiError.notFound({ message: "Could not delete product" });
      }
      return res.status(200).send({
        success: true,
        message: "product deleted successfully",
        result: deletedProduct,
      });
    } else {
      res.status(403).send({ message: "Not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const findProductByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const userProduct = await findProductOwnerById(id);
    if (userProduct.length < 1) {
      throw ApiError.notFound({ message: "product could not be found" });
    }
    res.status(200).json({
      Success: true,
      Message: "product successfully fetched",
      data: userProduct,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// export const searchproductByTitle = async (req, res) => {
//   try {
//     const { searchQuery } = req.query;
//     const title = new RegExp(searchQuery, "i");
//     const products = await fetchAllproducts({ title });
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

export const searchProductByTitle = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const products = await getAllProducts({ title });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

// export const getproductsByTag = async (req, res) => {
//   const { tag } = req.params;
//   try {
//     const products = await getAllproducts({ tags: { $in: tag } });
//     res.json({
//       success: true,
//       message: "Successful",
//       data: products,
//     });
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const getRelatedproducts = async (req, res) => {
//   const tag = req.body;
//   try {
//     const products = await getAllproducts({ tags: { $in: tag } });
//     res.json({
//       success: true,
//       message: "Successful",
//       data: products,
//     });
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const getproductLikes = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!req.userId) {
//       return res.json({ message: "User is not authenticated" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ message: `No product exist with id: ${id}` });
//     }

//     const product = await findproductById(id);

//     const index = product.likes.findIndex((id) => id === String(req.userId));

//     if (index === -1) {
//       product.likes.push(req.userId);
//     } else {
//       product.likes = product.likes.filter((id) => id !== String(req.userId));
//     }

//     const updatedproduct = await updateproduct(id, product, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Successfully liked",
//       data: updatedproduct,
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };