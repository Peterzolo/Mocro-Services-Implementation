import {
  editUserInfo,
  findAllUsers,
  findUserById,
  removeUser,
} from "./user.dao.js";
import { createUser, signIn } from "./user.service.js";
import bcrypt from "bcryptjs";
import ApiError from "../../error/ApiError.js";

export const register = async (req, res) => {
  const body = req.body;
  try {
    const userObject = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
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
