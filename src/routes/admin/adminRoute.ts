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
import { uploadImages } from "../../controllers/admin/bunnyImages";
import { upload } from "../../middleware/multer";

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
adminRoutes.post("/create-car", userMiddleware, adminMiddleware, createCar);

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

adminRoutes.post(
  "/upload-images",
  userMiddleware,
  adminMiddleware,
  upload.single("images"),
  uploadImages
);

export { adminRoutes };
