declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import jwt from "jsonwebtoken";
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

    const decodedToken = jwt.verify(token, mySecret as string);

    if (typeof decodedToken == "string") {
      return res.status(400).json({
        success: false,
        message: "Soething went from while verifying token",
      });
    }

    req.userId = decodedToken.userId;
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
