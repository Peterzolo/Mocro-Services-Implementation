import Product from "./product.model.js";

export const saveProductPayload = async (args) => {
  const payload = await Product.create(args);
  return payload;
};

export const fetchAllProducts = async () => {
  const product = await Product.find({ status: "active" });

  return PORT;
};

export const findProductById = async (id) => {
  const Product = await Product.findById({ _id: id, status: "active" });
  return Product;
};

// export const findOneProduct = async(id) =>{
//   const Product = await Product.findById({_id : id})
//   return Product
// }

export const findProductByName = async (query) => {
  const Product = await Product.findOne(query);
  return Product;
};

export const updateProduct = async (id, ProductObj) => {
  const Product = await Product.findByIdAndUpdate(
    { _id: id },
    { $set: ProductObj },
    { new: true }
  );
  return Product;
};

export const deleteProduct = async (id, userId) => {
  const Product = await Product.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return Product;
};

export const findProductOwnerById = async (id) => {
  const Product = await Product.find({ status: "active", vendor: id });

  return Product;
};
