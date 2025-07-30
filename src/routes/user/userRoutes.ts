import { Router } from "express";
import { userMiddleware } from "../../middleware/userMiddleware";
import {
  disableUser,
  refreshToken,
  userGetDetails,
  userLogin,
  userSignup,
  userUpdate,
} from "../../controllers/user/userController";
import {
  cancelCarOrder,
  cancelTourOrder,
  createCarOrder,
  createTourOrder,
} from "../../controllers/user/orderController";

const userRoutes = Router();

// user signup end point
userRoutes.post("/signup", userSignup);

// user login end point
userRoutes.post("/login", userLogin);

// Refresh token endpoint
userRoutes.post("/refreshToken", refreshToken);

// fetching user deatils end point
userRoutes.get("/user-details", userMiddleware, userGetDetails);

// updating user details if needed
userRoutes.put("/update-details", userMiddleware, userUpdate);

// delete user
userRoutes.delete("/delete-user", userMiddleware, disableUser);

// -------------------------------------------- Order end Points by users only ----------------------------------------------------

// for creating car order
userRoutes.post("/create-carorder", userMiddleware, createCarOrder);

// Cancel car order
userRoutes.delete("/cancel-carorder", userMiddleware, cancelCarOrder);

// for creating tour orders
userRoutes.post("/create-tourorder", userMiddleware, createTourOrder);

// Cancel Tour Order
userRoutes.delete("/cancel-tourorder", userMiddleware, cancelTourOrder);

export { userRoutes };
