import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import {
  LoginSchema,
  SignSchema,
  UpdateUserinfo,
} from "../../zodTypes/forUser/zodUser";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessTokens, generateRefreshTokens } from "../../utils/token";

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
    const { email, password } = parsedData.data;

    const existingUser = await prisma.userModel.findFirst({
      where: {
        email: email,
      },
    });

    // user information in the backend verification
    if (!existingUser) {
      return res.status(400).json({
        message: "Please Signin before login",
        success: false,
      });
    }

    if (!existingUser.isActive) {
      await prisma.userModel.update({
        where: {
          id: existingUser.id,
        },
        data: {
          isActive: true,
        },
      });
      console.log("User is activated");
    }

    //password verification
    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password/Email is incorrect, while Login",
      });
    }

    const decodedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!decodedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password/Email is incorrect, while Login",
      });
    }

    // if (!mySecret) {
    //   throw new Error("Jwt secret is not defined");
    // }

    // const token = jwt.sign({ userId: existingUser.id }, mySecret, {
    //   expiresIn: "2h",
    // });
    const accessToken = generateAccessTokens(existingUser.id);

    const refreshToken = generateRefreshTokens(existingUser.id);

    res.status(200).json({
      success: true,
      message: "User login successfull",
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: existingUser,
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

    const { username, email, oldPassword, newPassword, phoneNumber } =
      parsedData.data;

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

    if (existingUser.email === email) {
      return res.status(400).json({
        success: false,
        message: "User with the same email address exists",
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
        // phoneNumber: phoneNumber,
      },
    });

    //FIXME  After updating the use the old JWT token should not be valid,

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
const disableUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { password } = req.body;

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

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your password before deleting",
      });
    }

    const validPassowrd = await bcrypt.compare(password, userData.password);

    if (!validPassowrd) {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }

    //NOTE:- add one more database query where it delete orders of the user as well before deleting the user deatils

    const userDeleted = await prisma.userModel.update({
      where: {
        id: userData.id,
      },
      data: {
        isActive: false,
      },
    });

    res.status(200).json({
      success: true,
      message: "User diactivated successfully",
      data: userDeleted,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "Something went wrong while Deleting user, you might have orders that are not completed. Please complete or delete the order",
      error: (error as Error).message,
    });
  }
};

// refresh and access token endpoints

const refreshToken = async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.headers["authorization"];

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not provided",
    });
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await prisma.userModel.findFirst({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newAccessToken = generateAccessTokens(user.id);
    const newRefreshToken = generateRefreshTokens(user.id);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export {
  userSignup,
  userLogin,
  userGetDetails,
  userUpdate,
  disableUser,
  refreshToken,
};
