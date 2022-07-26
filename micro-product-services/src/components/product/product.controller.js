import mongoose from "mongoose";
import {
  deletePost,
  fetchAllPosts,
  findPostById,
  findPostOwnerById,
  updatePost,
} from "./product.dao.js";
import ApiError from "../../error/ApiError.js";

import { createPost } from "./post.service.js";
import cloudinary from "../../utils/cloudinary.js";
import { findUserById } from "../user/user.dao.js";
import User from "../user/user.model.js";

export const sendPost = async (req, res) => {
  try {
    const {
      description,
      likes,
      user,
      image,
      createdAt,
      status,
    } = req.body;
    const userId = req.user;
    const findUser = userId;
    // if (user === findUser._id.toString() || findUser.isAdmin === true) {
    // const result = await cloudinary.uploader.upload(req.file.path);
    const dataObject = {
      image,
      description,
      likes,
      user,
      createdAt,
      status,
      createdAt: new Date().toString(),
    };
    const postData = await createPost(dataObject);
    res.status(200).json({
      success: true,
      message: "Post successfully created",
      result: postData,
    });
    // } else {
    //   res.send({ message: "You are not authorized" });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await fetchAllPosts();
    if (!allPosts.length) {
      throw ApiError.notFound("No post Found");
    }
    res.status(200).json({
      postCount: allPosts.length,
      success: true,
      message: "Successfully fetched all posts",
      result: allPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const id = req.params.id;
    const findPost = await findPostById(id);
    if (findPost) {
      const post = findPost;
      res.status(200).send({
        Success: true,
        message: "post successfully fetched",
        result: post,
      });
    } else {
      res.status(401).send({ message: "Post Not Found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error has occured" });
  }
};

export const updateAPost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Post  id" });
    }

    const post = await findPostById(id);

    if (post.user._id.toString() === user._id || user.isAdmin === true) {
      if (post.status === "inactive") {
        throw ApiError.notFound({ message: "Post not found" });
      }

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinary_id);
      // Upload image to cloudinary
      let result;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        title: req.body.title || post.title,
        description: req.body.description || post.description,
        title: req.body.title || post.title,
        image: result?.secure_url || post.image,
        // user: post.user,
        cloudinary_id: result?.public_id || post.cloudinary_id,
      };

      let editedPost = await updatePost(id, data);

      if (!editedPost) {
        throw ApiError.notFound({ message: "post not available" });
      }
      return res.status(200).send({
        message: "post updated successfully",
        content: editedPost,
        success: true,
      });
    } else {
      res.status(403).send({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const removePost = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const findPost = await findPostById(id);

    console.log("UserId", typeof userId._id);
    console.log("Find Post", typeof findPost.user._id);

    if (findPost.user._id.toString() === userId._id) {
      if (findPost.status === "inactive") {
        throw ApiError.notFound({ message: "post not available" });
      }
      await cloudinary.uploader.destroy(findPost.cloudinary_id);

      const query = id;

      let deletedPost = await deletePost(query);

      if (!deletedPost) {
        throw ApiError.notFound({ message: "Could not delete post" });
      }
      return res.status(200).send({
        success: true,
        message: "post deleted successfully",
        result: deletedPost,
      });
    } else {
      res.status(403).send({ message: "Not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const findPostByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const userPost = await findPostOwnerById(id);
    if (userPost.length < 1) {
      throw ApiError.notFound({ message: "post could not be found" });
    }
    res.status(200).json({
      Success: true,
      Message: "post successfully fetched",
      data: userPost,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// export const searchpostByTitle = async (req, res) => {
//   try {
//     const { searchQuery } = req.query;
//     const title = new RegExp(searchQuery, "i");
//     const posts = await fetchAllposts({ title });
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

export const searchPostByTitle = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await getAllPosts({ title });
    res.json(posts);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

// export const getPostsByTag = async (req, res) => {
//   const { tag } = req.params;
//   try {
//     const posts = await getAllPosts({ tags: { $in: tag } });
//     res.json({
//       success: true,
//       message: "Successful",
//       data: posts,
//     });
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const getRelatedPosts = async (req, res) => {
//   const tag = req.body;
//   try {
//     const posts = await getAllPosts({ tags: { $in: tag } });
//     res.json({
//       success: true,
//       message: "Successful",
//       data: posts,
//     });
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const getPostLikes = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!req.userId) {
//       return res.json({ message: "User is not authenticated" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ message: `No post exist with id: ${id}` });
//     }

//     const post = await findPostById(id);

//     const index = post.likes.findIndex((id) => id === String(req.userId));

//     if (index === -1) {
//       post.likes.push(req.userId);
//     } else {
//       post.likes = post.likes.filter((id) => id !== String(req.userId));
//     }

//     const updatedpost = await updatePost(id, post, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Successfully liked",
//       data: updatedpost,
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await findPostById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ message: "Post disliked" });
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ message: "Post liked" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await fetchAllPosts({ user: userId });
    console.log("CURRENT POST", currentUserPosts);

    const followingPosts = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    const timeLinePosts = currentUserPosts
      .concat(...followingPosts[0].followingPosts)
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    res.status(200).json({
      success: true,
      message: "Posts successfully fetched",
      result: timeLinePosts,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
