import { findPostById, findPostByName, savePostPayload } from "./post.dao.js";
import ApiError from "../../error/ApiError.js";

export const createPost = async ({
  description,
  user,
  image,
  likes,
  cloudinary_id,
  createdAt,
  status,
}) => {
  const postObject = {
    description,
    user,
    image,
    likes,
    cloudinary_id,
    createdAt,
    status,
  };

  // const postExists = await findPostByName({ title });

  // if (postExists) {
  //   throw ApiError.alreadyExists({
  //     message: "Post with this title has already been created",
  //   });
  // }

  const post = await savePostPayload(postObject);
  return {
    createdAt: new Date().toISOString(),
    image: post.image,
    user: post.user,
    cloudinary_id: post.cloudinary_id,
    description: post.description,
    likes: post.likes,
    status: post.status,
    _id: post._id,
  };
};
