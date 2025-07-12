import { Router } from "express";
import { adminMiddleware } from "../../middleware/adminMiddleware";
import {
  getAllUserDetails,
  updateUserRole,
} from "../../controllers/admin/adminController";
import { userMiddleware } from "../../middleware/userMiddleware";
import {
  createCar,
  getAllCarsDetail,
  getCarDetails,
} from "../../controllers/admin/carsController";

const adminRoutes = Router();

adminRoutes.get(
  "/get-allUserDetails",
  userMiddleware,
  adminMiddleware,
  getAllUserDetails
);

adminRoutes.put(
  "/update-userRole",
  userMiddleware,
  adminMiddleware,
  updateUserRole
);

adminRoutes.post("/create-car", userMiddleware, adminMiddleware, createCar);
adminRoutes.post(
  "/get-carDetail",
  userMiddleware,
  adminMiddleware,
  getCarDetails
);

adminRoutes.get(
  "/get-allCarsDetail",
  userMiddleware,
  adminMiddleware,
  getAllCarsDetail
);

export { adminRoutes };
