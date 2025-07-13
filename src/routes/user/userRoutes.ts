import { Router } from "express";
import { userMiddleware } from "../../middleware/userMiddleware";
import {
  deleteUser,
  userGetDetails,
  userLogin,
  userSignup,
  userUpdate,
} from "../../controllers/user/userController";
import {
  createCarOrder,
  createTourOrder,
} from "../../controllers/user/orderController";

const userRoutes = Router();

// user signup end point
userRoutes.post("/signup", userSignup);

// user login end point
userRoutes.post("/login", userLogin);

// fetching user deatils end point
userRoutes.get("/user-details", userMiddleware, userGetDetails);

// updating user details if needed
userRoutes.put("/update-details", userMiddleware, userUpdate);

// delete user
userRoutes.delete("/delete-user", userMiddleware, deleteUser);

// -------------------------------------------- Order end Points by users only ----------------------------------------------------

// for creating car order
userRoutes.post("/create-Carorder", userMiddleware, createCarOrder);

// for creating tour orders
userRoutes.post("/create-tourorder", userMiddleware, createTourOrder);

export { userRoutes };
