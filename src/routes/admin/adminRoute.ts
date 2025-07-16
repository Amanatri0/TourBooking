import { Router } from "express";
import { adminMiddleware } from "../../middleware/adminMiddleware";
import {
  getAllUserDetails,
  updateUserRole,
} from "../../controllers/admin/adminController";
import { userMiddleware } from "../../middleware/userMiddleware";
import {
  createCar,
  deleteCar,
  getAllCarsDetail,
  getCarDetails,
  updateCarDetails,
} from "../../controllers/admin/carsController";
import {
  createTour,
  getTourDetails,
} from "../../controllers/admin/toursController";
import { uploadImages } from "../../middleware/multer/bunnyImages";
import { upload } from "../../middleware/multer/multer";
import {
  addDriver,
  disableDriver,
  getAllDriverDetails,
  getDriver,
  updateDriver,
} from "../../controllers/admin/driverController";

const adminRoutes = Router();

// Fetch all the users in the database
adminRoutes.get(
  "/get-allUserDetails",
  userMiddleware,
  adminMiddleware,
  getAllUserDetails
);

// Can update user specific role
adminRoutes.put(
  "/update-userRole",
  userMiddleware,
  adminMiddleware,
  updateUserRole
);

//-------------------------------------------------------- Car endpoint -----------------------------------------------------------------------

// Can create new cars according to needs
adminRoutes.post(
  "/create-car",
  userMiddleware,
  adminMiddleware,
  upload.single("images"),
  uploadImages,
  createCar
);

// Can update existing cars
adminRoutes.put(
  "/update-car",
  userMiddleware,
  adminMiddleware,
  updateCarDetails
);

// can delete existing cars
adminRoutes.delete("/delete-car", userMiddleware, adminMiddleware, deleteCar);

// can get a single cars details
adminRoutes.post(
  "/get-carDetail",
  userMiddleware,
  adminMiddleware,
  getCarDetails
);

// can get all the cars present in the database
adminRoutes.get(
  "/get-allCarsDetail",
  userMiddleware,
  adminMiddleware,
  getAllCarsDetail
);

// ------------------------------------------------------- Tour endpoint ----------------------------------------------------------------------

adminRoutes.post("/create-tour", userMiddleware, adminMiddleware, createTour);

adminRoutes.get(
  "/get-tourDetail",
  userMiddleware,
  adminMiddleware,
  getTourDetails
);

// -------------------------------------------------------- Driver Endpoint --------------------------------------------------------------------

adminRoutes.post("add-driver", userMiddleware, adminMiddleware, addDriver);
adminRoutes.get(
  "get-driverDetails",
  userMiddleware,
  adminMiddleware,
  getDriver
);
adminRoutes.get(
  "get-allDriveriverDetails",
  userMiddleware,
  adminMiddleware,
  getAllDriverDetails
);
adminRoutes.put(
  "update-driverDetails",
  userMiddleware,
  adminMiddleware,
  updateDriver
);

adminRoutes.delete(
  "delete-driverDetails",
  userMiddleware,
  adminMiddleware,
  disableDriver
);

export { adminRoutes };
