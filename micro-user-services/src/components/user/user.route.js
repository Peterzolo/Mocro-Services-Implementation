import express from "express";
const userRouter = express.Router();

import {
  deleteUser,
  fetchAllUsers,
  fetchUserDetails,
  register,
  updateUserInfo,
  userLogin,
} from "./user.controller.js";

userRouter.post("/register", register);
userRouter.post("/login", userLogin);
userRouter.get("/fetch-all", fetchAllUsers);
userRouter.get("/fetch-one/:id", fetchUserDetails);

userRouter.put("/update/:id", updateUserInfo);
userRouter.delete("/remove/:id", deleteUser);

export default userRouter;
