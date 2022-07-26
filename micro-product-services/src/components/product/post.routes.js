import express from "express";
// import upload from "../../utils/multer.js"

const postRouter = express.Router();

import {
  getAllPosts,
  // getPostLikes,
  getOnePost,
  getTimelinePosts,
  likePost,
  // getRelatedPosts,
  removePost,
  searchPostByTitle,
  sendPost,
  updateAPost,
} from "./post.controller.js";
import { authorizedAndAdmin, protect } from "../../middleware/auth2.js";
import { newUpload } from "../../utils/multer.js";
import { upload } from "../uploadImage/multer-config/index.js";

// postRouter.post("/create", authorizedAndAdmin, upload.single("file"), postPost);
postRouter.post("/create",sendPost);
postRouter.get("/fetch-all", getAllPosts);
postRouter.get("/fetch-one/:id", getOnePost);
postRouter.put(
  "/edit/:id",
  upload.single("file"),
  authorizedAndAdmin,
  updateAPost
);
postRouter.delete("/remove/:id", authorizedAndAdmin, removePost);
postRouter.get("/search", searchPostByTitle);
postRouter.put("/:id/like", protect, likePost);
postRouter.get("/:id/timeline", getTimelinePosts);

export default postRouter;
