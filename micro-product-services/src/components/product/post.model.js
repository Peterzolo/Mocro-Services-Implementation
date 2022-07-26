import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    cloudinary_id: {
      type: String,
    },
    likes: [],
    description: {
      type: String,
      required: true,
    },

    image: {
    type: String
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

const Post = mongoose.model("post", PostSchema);

export default Post;
