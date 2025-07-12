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
const mySecret = process.env.JWT_SECRET;

const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Soething went from while verifying token",
      });
    }

    if (!mySecret) {
      throw new Error("Jwt Secret is not defined in environment variables");
    }

    const decodedToken = jwt.verify(token, mySecret) as JwtPayload;

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
