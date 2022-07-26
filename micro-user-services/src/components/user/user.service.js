import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { findUserByEmail, saveUserPayload } from "./user.dao.js";
import ApiError from "../../error/ApiError.js";

export const createUser = async ({
  firstName,
  lastName,
  email,
  username,
  password,
  profilePicture,
  coverPicture,
  about,
  livesIn,
  worksAt,
  relationship,
  country,
  followers,
  following,
  isAdmin,
  status,
}) => {
  const findUser = await findUserByEmail({ email });
  if (findUser) {
    throw ApiError.alreadyExists({ message: "User already exists" });
  }
  const userObject = {
    firstName,
    lastName,
    email,
    username,
    password,
    profilePicture,
    coverPicture,
    about,
    livesIn,
    worksAt,
    relationship,
    country,
    followers,
    following,
    isAdmin,
    status,
  };

  const savedUser = await saveUserPayload(userObject);

  const payload = {
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    username: savedUser.username,
    email: savedUser.email,
    _id: savedUser._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    email: savedUser.email,
    username: savedUser.username,
    profilePicture: savedUser.profilePicture,
    coverPicture: savedUser.coverPicture,
    about: savedUser.about,
    livesIn: savedUser.livesIn,
    worksAt: savedUser.worksAt,
    relationship: savedUser.relationship,
    country: savedUser.country,
    followers: savedUser.followers,
    following: savedUser.following,
    isAdmin: savedUser.isAdmin,
    isAdmin: savedUser.isAdmin,
    _id: savedUser._id,
    token,
    status,
  };
};

export const signIn = async (email, password) => {
  const user = await findUserByEmail({ email });

  if (!user) {
    throw ApiError.notFound({ message: "User does not exist" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw ApiError.wrongCredential({ message: "Wrong credential" });
  }
  if (user.status !== "active") {
    throw ApiError.notFound({ message: "User does not exist" });
  }

  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    email: user.email,
    username: user.username,
    _id: user._id,
    isAdmin: user.isAdmin,
    token,
  };
};
