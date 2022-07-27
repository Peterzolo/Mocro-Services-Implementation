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
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
