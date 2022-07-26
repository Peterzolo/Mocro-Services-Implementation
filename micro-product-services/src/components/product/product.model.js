import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema(
  {
    cloudinary_id: {
      type: String,
    },

    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    price: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductSchema);

export default Product;
