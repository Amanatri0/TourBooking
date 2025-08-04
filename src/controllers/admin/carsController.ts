declare global {
  namespace Express {
    interface Request {
      carImageUrl?: string;
    }
  }
}

import axios from "axios";
import crypto from "crypto";
import path from "path";
// import multer from "multer";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  CarSchema,
  DeleteCarSchema,
  UpdateCarSchema,
} from "../../zodTypes/forAdmin/zodAdmin";

const prisma = new PrismaClient();

const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const STORAGE_ZONE = process.env.STORAGE_ZONE;
const FOLDER = process.env.FOLDER;
const CDN_URL = process.env.CDN_URL!;

// upload car images
const uploadImages = async (file: Express.Multer.File, carId: string) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const fileName = `${crypto.randomBytes(20).toString("hex")}${ext}`;

  const uploadUrl = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${FOLDER}/${fileName}`;

  // Upload to Bunny using Axios
  await axios.put(uploadUrl, file.buffer, {
    headers: {
      AccessKey: BUNNY_ACCESS_KEY,
      "Content-Type": file.mimetype,
    },
    maxBodyLength: Infinity, // Chnage the body length according to the image size
  } as any);

  const publicUrl = `${CDN_URL}/${FOLDER}/${fileName}`;

  return publicUrl;
};

// car creaetd by admin
const createCar = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while creating cars",
    });
  }

  // get the file from the file-data
  const file = req.file;

  console.log("Req body", req.body);

  console.log("Fie name", file);

  if (!req.file || !file) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  // zod input validation
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
        distance: distance,
        capacity: capacity,
        fair: fair,
        createdBy: {
          connect: {
            id: adminId,
          },
        },
      },
    });

    if (!createCar) {
      return res.status(404).json({
        success: false,
        message: "Unable to create Car",
      });
    }

    const uploadedImages = await uploadImages(file, createCar.id);

    if (!uploadedImages) {
      return res.status(404).json({
        success: false,
        message: "Unable to Upload Car images",
      });
    }

    const carCreated = await prisma.carModel.update({
      where: {
        id: createCar.id,
      },
      data: {
        carImage: uploadedImages,
      },
    });

    return res.status(200).json({
      success: true,
      message: "New car has been created",
      data: carCreated,
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
    const { id, carNumber } = req.body;

    const existingCar = await prisma.carModel.findFirst({
      where: {
        OR: [
          {
            id: id,
          },
          { carNumber: carNumber },
        ],
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

// admin can update car details
const updateCarDetails = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating cars",
    });
  }

  const parsedData = UpdateCarSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid details for updating",
      error: parsedData.error.issues,
    });
  }

  try {
    const { id, carName, carImage, carNumber, distanace, capacity, fair } =
      parsedData.data;

    const existingCar = await prisma.carModel.findFirst({
      where: {
        OR: [{ id: id }, { carNumber: carNumber }], // Implement this in all route
      },
    });

    if (!existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car doesn't exists",
      });
    }

    const updateCarDetails = await prisma.carModel.update({
      where: {
        id: existingCar.id,
      },
      data: {
        carName: carName,
        carImage: carImage,
        carNumber: carNumber,
        distance: distanace,
        capacity: capacity,
        fair: fair,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Car details updated successfully",
      data: updateCarDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Car",
      error: (error as Error).message,
    });
  }
};

// admin can delete cars
const deleteCar = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating cars",
    });
  }

  const parsedData = DeleteCarSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid details for updating",
      error: parsedData.error.issues,
    });
  }

  try {
    const { id, carNumber } = parsedData.data;

    const existingCar = await prisma.carModel.findFirst({
      where: {
        OR: [{ id: id }, { carNumber: carNumber }],
      },
    });

    if (!existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car doesn't exists",
      });
    }

    const deleteCar = await prisma.carModel.delete({
      where: {
        id: existingCar.id,
        carNumber: existingCar.carNumber,
        carName: existingCar.carName,
      },
    });

    if (!deleteCar) {
      return res.status(400).json({
        succes: false,
        message: "Unable to delete car",
      });
    }

    return res.status(400).json({
      success: true,
      message: "Car details updated successfully",
      data: deleteCar,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Car",
      error: (error as Error).message,
    });
  }
};

export { createCar, getCarDetails, updateCarDetails, deleteCar };
