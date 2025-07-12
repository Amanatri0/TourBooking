import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { userRoutes } from "./routes/user/userRoutes";
import { adminRoutes } from "./routes/admin/adminRoute";

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
