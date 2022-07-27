
import mongoose from "mongoose";
import {
  deleteOrder,
  fetchAllOrders,
  findOrderById,
  findOrderOwnerById,
  updateOrder,
} from "./order.dao.js";
import ApiError from "../../error/ApiError.js";
import { createOrder } from "./order.service.js";

export const addOrder = async (req, res) => {
  try {
    const {
      products,
      user,
      total_price,
      status,
    } = req.body;
    const userId = req.user;
    const findUser = userId;
    // if (user === findUser._id.toString() || findUser.isAdmin === true) {
    // const result = await cloudinary.uploader.upload(req.file.path);
    const dataObject = {
      products,
      user,
      total_price,
      status,
    };
    const orderData = await createOrder(dataObject);
    res.status(200).json({
      success: true,
      message: "order successfully created",
      result: orderData,
    });
    // } else {
    //   res.send({ message: "You are not authorized" });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await fetchAllOrders();
    if (!allOrders.length) {
      throw ApiError.notFound("No order Found");
    }
    res.status(200).json({
      orderCount: allOrders.length,
      success: true,
      message: "Successfully fetched all orders",
      result: allOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const findOrder = await findOrderById(id);
    if (findOrder) {
      const order = findOrder;
      res.status(200).send({
        Success: true,
        message: "order successfully fetched",
        result: order,
      });
    } else {
      res.status(401).send({ message: "order Not Found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Error has occured" });
  }
};

export const updateAnOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid order  id" });
    }

    const order = await findOrderById(id);

    if (order.user._id.toString() === user._id || user.isAdmin === true) {
      if (order.status === "inactive") {
        throw ApiError.notFound({ message: "order not found" });
      }

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(order.cloudinary_id);
      // Upload image to cloudinary
      let result;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        title: req.body.title || order.title,
        description: req.body.description || order.description,
        title: req.body.title || order.title,
        image: result?.secure_url || order.image,
        // user: order.user,
        cloudinary_id: result?.public_id || order.cloudinary_id,
      };

      let editedorder = await updateorder(id, data);

      if (!editedorder) {
        throw ApiError.notFound({ message: "order not available" });
      }
      return res.status(200).send({
        message: "order updated successfully",
        content: editedorder,
        success: true,
      });
    } else {
      res.status(403).send({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const removeOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const findorder = await findorderById(id);

    console.log("UserId", typeof userId._id);
    console.log("Find order", typeof findorder.user._id);

    if (findorder.user._id.toString() === userId._id) {
      if (findorder.status === "inactive") {
        throw ApiError.notFound({ message: "order not available" });
      }
      await cloudinary.uploader.destroy(findorder.cloudinary_id);

      const query = id;

      let deletedorder = await deleteorder(query);

      if (!deletedorder) {
        throw ApiError.notFound({ message: "Could not delete order" });
      }
      return res.status(200).send({
        success: true,
        message: "order deleted successfully",
        result: deletedorder,
      });
    } else {
      res.status(403).send({ message: "Not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const findorderByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const userorder = await findorderOwnerById(id);
    if (userorder.length < 1) {
      throw ApiError.notFound({ message: "order could not be found" });
    }
    res.status(200).json({
      Success: true,
      Message: "order successfully fetched",
      data: userorder,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// export const searchorderByTitle = async (req, res) => {
//   try {
//     const { searchQuery } = req.query;
//     const title = new RegExp(searchQuery, "i");
//     const orders = await fetchAllorders({ title });
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

export const searchorderByTitle = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const orders = await getAllorders({ title });
    res.json(orders);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

// export const getordersByTag = async (req, res) => {
//   const { tag } = req.params;
//   try {
//     const orders = await getAllorders({ tags: { $in: tag } });
//     res.json({
//       success: true,
//       message: "Successful",
//       data: orders,
//     });
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const getRelatedorders = async (req, res) => {
//   const tag = req.body;
//   try {
//     const orders = await getAllorders({ tags: { $in: tag } });
//     res.json({
//       success: true,
//       message: "Successful",
//       data: orders,
//     });
//   } catch (error) {
//     res.status(404).json({ message: "Something went wrong" });
//   }
// };

// export const getorderLikes = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!req.userId) {
//       return res.json({ message: "User is not authenticated" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ message: `No order exist with id: ${id}` });
//     }

//     const order = await findorderById(id);

//     const index = order.likes.findIndex((id) => id === String(req.userId));

//     if (index === -1) {
//       order.likes.push(req.userId);
//     } else {
//       order.likes = order.likes.filter((id) => id !== String(req.userId));
//     }

//     const updatedorder = await updateorder(id, order, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Successfully liked",
//       data: updatedorder,
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const likeorder = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const order = await findorderById(id);
    if (order.likes.includes(userId)) {
      await order.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ message: "order disliked" });
    } else {
      await order.updateOne({ $push: { likes: userId } });
      res.status(200).json({ message: "order liked" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTimelineorders = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserorders = await fetchAllorders({ user: userId });
    console.log("CURRENT order", currentUserorders);

    const followingorders = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "following",
          foreignField: "userId",
          as: "followingorders",
        },
      },
      {
        $project: {
          followingorders: 1,
          _id: 0,
        },
      },
    ]);

    const timeLineorders = currentUserorders
      .concat(...followingorders[0].followingorders)
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    res.status(200).json({
      success: true,
      message: "orders successfully fetched",
      result: timeLineorders,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
