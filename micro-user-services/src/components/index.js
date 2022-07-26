import userRoutes from "./user/user.route.js";
import postRoutes from "./post/post.routes.js";
import uploadRoutes from "./uploadImage/routes.js";

export const componentModule = {
  userModule: {
    routes: userRoutes,
  },
  postModule: {
    routes: postRoutes,
  },
  uploadModule: {
    routes: uploadRoutes,
  },
};

