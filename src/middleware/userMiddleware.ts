declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();
const mySecret = process.env.ACCESS_TOKEN_SECRET;

const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authHeader exists and follows "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access token not found or invalid format" });
    }

    // extract the JWT token
    const accessToken = authHeader.split(" ")[1];

    if (!mySecret) {
      throw new Error("Jwt Secret is not defined in environment variables");
    }

    const decodedToken = jwt.verify(accessToken, mySecret) as JwtPayload;

    if (typeof decodedToken == "string") {
      return res.status(400).json({
        success: false,
        message: "Soething went from while verifying token",
      });
    }

    const existingUser = await prisma.userModel.findFirst({
      where: {
        id: decodedToken.userId,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    req.userId = existingUser.id;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching data",
      error: (error as Error).message,
    });
  }
};

export { userMiddleware };
