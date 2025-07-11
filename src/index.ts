import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { userRoutes } from "./routes/user/userRoutes";

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
