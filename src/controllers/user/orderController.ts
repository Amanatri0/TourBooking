import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// car order   ------------>
const createCarOrder = async (req: Request, res: Response) => {
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

const cancelCarOrder = async (req: Request, res: Response) => {
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
        message: "Please select a car that you want to cancel",
      });
    }

    const existingOrder = await prisma.orderModel.findFirst({
      where: {
        userModelId: userId,
        carModelId: carId,
      },
    });

    if (!existingOrder) {
      return res.status(400).json({
        success: false,
        message: "You don't have any order to delete",
      });
    }

    const cancelCarOrder = await prisma.orderModel.delete({
      where: {
        id: existingOrder.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order Canceled successfully",
      data: cancelCarOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Creating an order",
      error: (error as Error).message,
    });
  }
};

// tour package order    ---------------->
const createTourOrder = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "Order cannot be created",
    });
  }

  try {
    const { tourId } = req.body;

    if (!tourId) {
      return res.status(404).json({
        success: false,
        message: "Please provide a car that you want to order",
      });
    }

    const existingOrder = await prisma.orderModel.findFirst({
      where: {
        userModelId: userId,
        tourModelId: tourId,
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
        Tour: {
          connect: {
            id: tourId,
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

const cancelTourOrder = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "Order cannot be created",
    });
  }

  try {
    const { tourId } = req.body;

    if (!tourId) {
      return res.status(404).json({
        success: false,
        message: "Please provide a Tour that you want to order",
      });
    }

    const existingOrder = await prisma.orderModel.findFirst({
      where: {
        userModelId: userId,
        tourModelId: tourId,
      },
    });

    if (!existingOrder) {
      return res.status(400).json({
        success: false,
        message: "You don't have any order to delete",
      });
    }

    const createOrder = await prisma.orderModel.delete({
      where: {
        id: existingOrder.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order Deleted successfully",
      data: createOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Deleting an order",
      error: (error as Error).message,
    });
  }
};

export { createCarOrder, createTourOrder, cancelCarOrder, cancelTourOrder };
