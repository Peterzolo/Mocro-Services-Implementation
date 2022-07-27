import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema(
  {
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],

    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],

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

const Post = mongoose.model("post", PostSchema);

export default Post;
