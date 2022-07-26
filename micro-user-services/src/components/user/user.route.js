import express from "express";
const userRouter = express.Router();

import {
  deleteUser,
  fetchAllUsers,
  fetchUserDetails,
  postFollowUser,
  register,
  unfollowUser,
  updateUserInfo,
  userLogin,
} from "./user.controller.js";
import { protect, registeredAndAuthorized } from "../../middleware/auth2.js";
import { validate, validateRegister } from "./user.validator.js";
// import { upload } from "../../utils/multer.js";

userRouter.post(
  "/register",
  // upload.single("profilePicture"),
  // validateRegister,
  // validate,
  register
);
userRouter.post("/login", userLogin);
userRouter.get("/fetch-all", fetchAllUsers);
userRouter.get("/fetch-one/:id", fetchUserDetails);
// userRouter.put('/update/profile', protect, updateUserprofile);
userRouter.put("/update/:id", registeredAndAuthorized, updateUserInfo);
userRouter.delete("/remove/:id", registeredAndAuthorized, deleteUser);
userRouter.put("/:id/follow", protect, postFollowUser);
userRouter.put("/:id/unfollow", protect, unfollowUser);

export default userRouter;
