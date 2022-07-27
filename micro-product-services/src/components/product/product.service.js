import {
  findProductById,
  findProductByName,
  saveProductPayload,
} from "./product.dao.js";
import ApiError from "../../error/ApiError.js";


export const createProduct = async ({
  name,
  description,
  image,
  price,
  cloudinary_id,
  status,
}) => {
  const productObject = {
    name,
    description,
    image,
    price,
    cloudinary_id,
    status,
  };

  // const productExists = await findproductByName({ title });

  // if (productExists) {
  //   throw ApiError.alreadyExists({
  //     message: "product with this title has already been created",
  //   });
  // }

  const product = await saveProductPayload(productObject);
  return {
    image: product.image,
    price: product.price,
    name: product.name,
    cloudinary_id: product.cloudinary_id,
    description: product.description,
    status: product.status,
    _id: product._id,
  };
};

