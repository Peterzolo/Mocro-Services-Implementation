import User from "./user.model.js";

export const findUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne(email);
  return user;
};

export const findAllUsers = async () => {
  const users = await User.find({ status: "active" }).select("-password");
  return users;
};

export const saveUserPayload = async (args) => {
  const payload = await User.create(args);
  return payload;
};

export const editUserInfo = async (id, editObj) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: editObj },
    { new: true }
  ).select("-password");
  return user;
};



export const removeUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { status: "inactive" },
    { new: true }
  );
  return user;
};
