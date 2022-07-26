import {
  editUserInfo,
  findAllUsers,
  findUserById,
  removeUser,
} from "./user.dao.js";
import { createUser, signIn } from "./user.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../../utils/cloudinary.js";
import ApiError from "../../error/ApiError.js";

export const register = async (req, res) => {
  const body = req.body;
  try {
    // const result = await cloudinary.uploader.upload(req.file.path);

    // if(profilePicture){
    //  return profilePicture = result.secure_url
    // }

    const userObject = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: body.password,
      // cloudinary_id: result.public_id,
      // coverPicture: result.secure_url,
      about: body.about,
      livesIn: body.livesIn,
      worksAt: body.worksAt,
      relationship: body.relationship,
      country: body.country,
      followers: body.followers,
      following: body.following,
      isAdmin: body.isAdmin,
      status: body.status,
    };
    const user = await createUser(userObject);
    res.status(200).json({
      Success: true,
      Message: "User successfully registered",
      result: user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await signIn(email, password);
    res.status(200).json({
      Success: true,
      message: "User successfully logged in",
      result: user,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const fetchAllUsers = async (req, res) => {
  const users = await findAllUsers();
  if (users.length < 1) {
    res.status(402).send({ message: "Users not found" });
  } else {
    res.status(201).send({
      success: true,
      message: "User successfully fetched",
      result: users,
    });
  }
};
export const fetchUserDetails = async (req, res) => {
  const id = req.params.id;

  const findUser = await findUserById(id);

  if (!findUser) {
    res.status(402).send({ message: "User not found" });
  } else {
    res.status(201).send({
      success: true,
      message: "User successfully fetched",
      result: findUser,
    });
  }
};

export const updateUserInfo = async (req, res) => {
  const id = req.params.id;
  const userId = req.user;
  const updateObj = req.body;

  try {
    const user = await findUserById(userId);

    if (id === user._id.toString() || user.isAdmin === true) {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await editUserInfo(id, updateObj);

      res.send({
        success: true,
        message: "Profile successfully updated",
        result: updatedUser,
      });
    } else {
      throw ApiError.forbidden({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.user;

  try {
    const user = await findUserById(userId);

    if (id === user._id.toString() || user.isAdmin === true) {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
      }
      const deletedUser = await removeUser(id);

      res.send({
        success: true,
        message: "Profile successfully updated",
        result: deletedUser,
      });
    } else {
      throw ApiError.forbidden({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const postFollowUser = async (req, res) => {
  const id = req.params.id;
  const _id = req.body._id;
  console.log(id, _id);
  if (_id == id) {
    res.status(403).json({ message: "You cannot follow yourself" });
  } else {
    try {
      const followUser = await findUserById(id);
      const followingUser = await findUserById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const _id = req.body._id;

  if (_id === id) {
    res.status(403).json({ message: "Action Forbidden" });
  } else {
    try {
      const unFollowUser = await findUserById(id);
      const unFollowingUser = await findUserById(_id);

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } });
        await unFollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json({message : "Unfollowed Successfully!"});
      } else {
        res.status(403).json({message : "You are not following this User"});
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// export const updateUserprofile = async (req, res) => {
//   const userId = req.userId;

//   const user = await findUserById(userId);
//   if (user) {
//     user.firstName = req.body.firstName || user.firstName;
//     user.lastName = req.body.lastName || user.lastName;
//     user.email = req.body.email || user.email;

//     if (req.body.password) {
//       user.password = bcrypt.hashSync(req.body.password, 8);
//     }
//     const updatedUser = await user.save();

//     const payload = {
//       _id: updatedUser._id,
//       email: updatedUser.email,
//       firstName: updatedUser.email,
//       lastName: updatedUser.lastName,
//       isAdmin: updatedUser.isAdmin,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     const savedUserProfile = {
//       _id: updatedUser._id,
//       firstName: updatedUser.firstName,
//       lastName: updatedUser.lastName,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//       // isSeller: user.isSeller,
//       token,
//     };

//     res.send({
//       success: true,
//       message: "Profile successfully updated",
//       result: savedUserProfile,
//     });
//   }
// };
