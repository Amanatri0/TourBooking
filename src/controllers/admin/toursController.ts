import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TourSchema } from "../../zodTypes/forAdmin/zodAdmin";

const prisma = new PrismaClient();
const createTour = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while creating cars",
    });
  }

  const parsedData = TourSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "please enter valid Tour information",
      error: parsedData.error.issues,
    });
  }
  try {
    const { tourName, description, fair } = parsedData.data;

    const existingTour = await prisma.tourModel.findFirst({
      where: {
        tourName: tourName,
      },
    });

    if (existingTour) {
      return res.status(404).json({
        success: false,
        message: "Tour already exists",
      });
    }

    const createTour = await prisma.tourModel.create({
      data: {
        tourName: tourName,
        description: description,
        fair: fair,
      },
    });

    return res.status(200).json({
      success: true,
      message: "New Tour has been created",
      data: createTour,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Creating Tour",
      error: (error as Error).message,
    });
  }
};

export { createTour };
