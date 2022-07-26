import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema(
  {
    cloudinary_id: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductSchema);

export default Product;
