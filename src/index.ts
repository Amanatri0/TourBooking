import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { userRoutes } from "./routes/user/userRoutes";
import { adminRoutes } from "./routes/admin/adminRoute";
import cors from "cors";
import { upload } from "./middleware/multer/multer";
import multer from "multer";

const port = process.env.PORT;
const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl requests
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
