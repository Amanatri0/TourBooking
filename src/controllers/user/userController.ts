import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import {
  LoginSchema,
  SignSchema,
  UpdateUserinfo,
} from "../../zodTypes/forUser/zodUser";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const mySecret = process.env.JWT_SECRET;

const prisma = new PrismaClient();

// user signup end point
const userSignup = async (req: Request, res: Response) => {
  // zod check for input validation while providing user details
  const parsedData = SignSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please enter valid information, while signing",
      success: false,
      error: parsedData.error.issues,
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
};

// user login end point
const userLogin = async (req: Request, res: Response) => {
  // zod check for input validation while providing user details
  const parsedData = LoginSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please enter valid information, while Login",
      success: false,
      error: parsedData.error.issues,
    });
  }

  try {
    const existingUser = await prisma.userModel.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

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

    if (!mySecret) {
      throw new Error("Jwt secret is not defined");
    }

    const token = jwt.sign({ userId: existingUser.id }, mySecret);

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
};

// fetching user deatils end point
const userGetDetails = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const userData = await prisma.userModel.findFirst({
      where: {
        id: userId,
      },
      omit: {
        password: true,
        role: true,
      },
    });

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User is not registered in the database",
      });
    }

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
};

// updating user details
const userUpdate = async (req: Request, res: Response) => {
  const userId = req.userId;

  // get the updated data from user
  const parsedData = UpdateUserinfo.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating",
      error: parsedData.error.issues,
    });
  }

  try {
    // check if the user exixts

    const { username, email, oldPassword, newPassword } = parsedData.data;

    const existingUser = await prisma.userModel.findFirst({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // verify the old password
    const verifiedPassword = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );

    if (!verifiedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user
    const updateUserDetails = await prisma.userModel.update({
      where: {
        id: userId,
      },
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: true,
      message: "User update successfull",
      data: updateUserDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating user",
      error: (error as Error).message,
    });
  }
};

//
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const userData = await prisma.userModel.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //NOTE:- add one more database query where it delete orders of the user as well before deleting the user deatils

    const userDeleted = await prisma.userModel.delete({
      where: {
        id: userData.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "user Deleted successfully",
      data: userDeleted,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Deleting user",
      error: (error as Error).message,
    });
  }
};

export { userSignup, userLogin, userGetDetails, userUpdate, deleteUser };
