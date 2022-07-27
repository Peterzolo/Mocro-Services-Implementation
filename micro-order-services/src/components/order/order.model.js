import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = mongoose.Schema(
  {
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],

    user: String,

    total_price: {
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

const Order = mongoose.model("order", OrderSchema);

export default Order;
