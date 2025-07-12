declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.userId;

    const adminData = await prisma.userModel.findFirst({
      where: {
        id: adminId,
      },
    });

    if (!adminData) {
      return res.status(400).json({
        success: false,
        message: "Something went from while fetching user",
      });
    }

    if (adminData.role !== 1) {
      return res.status(400).json({
        success: false,
        message: "Something went from while verifying admin token",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while login admin",
      error: (error as Error).message,
    });
  }
  next();
};

export { adminMiddleware };
