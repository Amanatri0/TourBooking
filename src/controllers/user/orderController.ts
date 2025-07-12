import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "Order cannot be created",
    });
  }

  try {
    const { carId } = req.body;

    if (!carId) {
      return res.status(404).json({
        success: false,
        message: "Please provide a car that you want to order",
      });
    }

    const existingOrder = await prisma.orderModel.findFirst({
      where: {
        userModelId: userId,
        carModelId: carId,
      },
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already created",
      });
    }

    const createOrder = await prisma.orderModel.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        Car: {
          connect: {
            id: carId,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: createOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Creating an order",
      error: (error as Error).message,
    });
  }
};

export { createOrder };
