import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  DeleteTourSchema,
  TourSchema,
  UpdateTourSchema,
} from "../../zodTypes/forAdmin/zodAdmin";

const prisma = new PrismaClient();

// admin can create tours
const createTour = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while creating Tours",
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

// admin can get tours details
const getTourDetails = async (req: Request, res: Response) => {
  try {
    const { id, tourName } = req.body;

    const existingTour = await prisma.tourModel.findFirst({
      where: {
        id: id,
        tourName: tourName,
      },
    });

    if (!existingTour) {
      return res.status(400).json({
        success: false,
        message: "Tour doesn't exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: existingTour,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching Tour",
      error: (error as Error).message,
    });
  }
};

// admin can update tour details
const updateTourDetails = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating Tours",
    });
  }

  const parsedData = UpdateTourSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid details for updating",
      error: parsedData.error.issues,
    });
  }

  try {
    const { id, tourName, description, fair } = parsedData.data;

    const existingTour = await prisma.tourModel.findFirst({
      where: {
        OR: [{ id: id }, { tourName: tourName }],
      },
    });

    if (!existingTour) {
      return res.status(400).json({
        success: false,
        message: "Tour doesn't exists",
      });
    }

    const updateTourDetails = await prisma.tourModel.update({
      where: {
        id: existingTour.id,
      },
      data: {
        tourName: tourName,
        description: description,
        fair: fair,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tour details updated successfully",
      data: updateTourDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Tour",
      error: (error as Error).message,
    });
  }
};

// admin can update tours
const deleteTour = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating cars",
    });
  }

  const parsedData = DeleteTourSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid details for updating",
      error: parsedData.error.issues,
    });
  }

  try {
    const { id, tourName } = parsedData.data;

    const existingTour = await prisma.tourModel.findFirst({
      where: {
        OR: [{ id: id }, { tourName: tourName }],
      },
    });

    if (!existingTour) {
      return res.status(400).json({
        success: false,
        message: "Tour doesn't exists",
      });
    }

    const deleteTour = await prisma.tourModel.delete({
      where: {
        id: existingTour.id,
        tourName: existingTour.tourName,
      },
    });

    if (!deleteTour) {
      return res.status(400).json({
        succes: false,
        message: "Unable to delete Tour",
      });
    }

    return res.status(400).json({
      success: true,
      message: "Tour details updated successfully",
      data: deleteTour,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Tour",
      error: (error as Error).message,
    });
  }
};

export { createTour, getTourDetails, updateTourDetails, deleteTour };
