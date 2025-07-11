import dotenv from "dotenv";
dotenv.config();

import { Request, Response, Router } from "express";
import { LoginSchema, SignSchema } from "../../zodTypes/zod";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userMiddleware } from "../../middleware/userMiddleware";

const mySecret = process.env.JWT_SECRET;

const prisma = new PrismaClient();

const userRoutes = Router();

// user signup end point
userRoutes.post("/signup", async (req: Request, res: Response) => {
  // zod check for input validation while providing user details
  const parsedData = SignSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please enter valid information, while signing",
      success: false,
    });
  }

  // try catch for correct information
  try {
    // check for already existing users
    const existingUser = await prisma.userModel.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const userData = await prisma.userModel.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "User created Successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while signin",
      error: (error as Error).message,
    });
  }
});

// user login end point
userRoutes.post("/login", async (req: Request, res: Response) => {
  // zod check for input validation while providing user details
  const parsedData = LoginSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please enter valid information, while Login",
      success: false,
    });
  }

  try {
    const existingUser = await prisma.userModel.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    console.log(existingUser);

    // user information in the backend verification
    if (!existingUser) {
      return res.status(400).json({
        message: "Please Signin before login",
        success: false,
      });
    }

    //password verification
    if (
      !parsedData.data.password ||
      typeof parsedData.data.password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Password/Email is incorrect, while Login",
      });
    }

    const decodedPassword = bcrypt.compare(
      parsedData.data.password,
      existingUser.password
    );

    if (!decodedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password/Email is incorrect, while Login",
      });
    }

    const token = jwt.sign({ userId: existingUser.id }, mySecret as string);

    res.status(200).json({
      success: true,
      message: "User login successfull",
      Token: token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Login",
      error: (error as Error).message,
    });
  }
});

// fetching user deatils end point

userRoutes.get(
  "/user-details",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    console.log(userId);

    try {
      const userData = await prisma.userModel.findFirst({
        where: {
          id: userId,
        },
        select: {
          username: true,
          email: true,
        },
      });

      console.log(userData);

      res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while Login",
        error: (error as Error).message,
      });
    }
  }
);

export { userRoutes };
