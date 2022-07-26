import Post from "./post.model.js";

export const savePostPayload = async (args) => {
  const payload = await Post.create(args);
  return payload;
};

export const fetchAllPosts = async () => {
  const post = await Post.find({ status: "active" }).populate(
    "user",
    "-password"
  );
  return post;
};

export const findPostById = async (id) => {
  const post = await Post.findById({ _id: id, status: "active" }).populate(
    "user",
    "-password"
  );
  return post;
};

// export const findOnePost = async(id) =>{
//   const Post = await Post.findById({_id : id})
//   return Post
// }

export const findPostByName = async (query) => {
  const post = await Post.findOne(query).populate("user", "-password");
  return post;
};

export const updatePost = async (id, postObj) => {
  const post = await Post.findByIdAndUpdate(
    { _id: id },
    { $set: postObj },
    { new: true }
  );
  return post;
};

export const deletePost = async (id, userId) => {
  const post = await Post.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return post;
};

export const findPostOwnerById = async (id) => {
  const post = await Post.find({ status: "active", vendor: id }).populate(
    "user",
    "-password"
  );
  return post;
};
