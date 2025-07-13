import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CarSchema } from "../../zodTypes/forAdmin/zodAdmin";

const prisma = new PrismaClient();

// car creaetd by admin
const createCar = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while creating cars",
    });
  }

  const parsedData = CarSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "please enter valid car information",
      error: parsedData.error.issues,
    });
  }
  try {
    const { carName, carNumber, distance, capacity, fair } = parsedData.data;

    const existingCar = await prisma.carModel.findFirst({
      where: {
        carNumber: carNumber,
      },
    });

    if (existingCar) {
      return res.status(404).json({
        success: false,
        message: "Car already exists",
      });
    }

    const createCar = await prisma.carModel.create({
      data: {
        carName: carName,
        carImage: "",
        carNumber: carNumber,
        distanace: distance,
        capacity: capacity,
        fair: fair,
        createdBy: {
          connect: {
            id: adminId,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "New car has been created",
      data: createCar,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Creating Car",
      error: (error as Error).message,
    });
  }
};

// only admin can fetch the car by the id
const getCarDetails = async (req: Request, res: Response) => {
  try {
    const { id, carName } = req.body;

    const existingCar = await prisma.carModel.findFirst({
      where: {
        id: id,
        carName: carName,
      },
    });

    if (!existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car doesn't exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car fetched successfully",
      data: existingCar,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching Car",
      error: (error as Error).message,
    });
  }
};

// only amdin can see all the cars and car details
const getAllCarsDetail = async (req: Request, res: Response) => {
  try {
    const allCarsDetail = await prisma.carModel.findMany({});

    return res.status(200).json({
      success: true,
      message: "Car fetched successfully",
      data: allCarsDetail,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching Car",
      error: (error as Error).message,
    });
  }
};

const updateCarDetails = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating cars",
    });
  }

  try {
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Car",
      error: (error as Error).message,
    });
  }
};

export { createCar, getCarDetails, getAllCarsDetail };
