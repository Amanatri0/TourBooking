import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { DriverSchema } from "../../zodTypes/forAdmin/zodAdmin";

const prisma = new PrismaClient();

// Maybe I should create another driver route where only drivers can login using driverMiddler and admins can also delete or update data there

const addDriver = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while adding Driver cars",
    });
  }

  const parsedData = DriverSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "please enter valid car information",
      error: parsedData.error.issues,
    });
  }

  try {
    const {
      driverName,
      phoneNumber,
      driverAddhar,
      driverPan,
      driverLicense,
      carId,
    } = parsedData.data;

    const existingDriver = await prisma.driverModel.findFirst({
      where: {
        AND: [{ phoneNumber: phoneNumber }, { carModelId: carId }],
      },
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver already exists",
      });
    }

    const existingCar = await prisma.carModel.findFirst({
      where: {
        id: carId,
      },
    });

    if (!existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car Doesn't exists",
      });
    }

    const createDriver = await prisma.driverModel.create({
      data: {
        driverName: driverName,
        phoneNumber: phoneNumber,
        driverAddhar: driverAddhar,
        driverPan: driverPan,
        driverLicense: driverLicense,
        carDetails: {
          connect: {
            id: carId,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "New Driver has been created",
      data: createDriver,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Adding Driver",
      error: (error as Error).message,
    });
  }
};

const getDriver = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while adding Driver cars",
    });
  }

  try {
    const driverId = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Please provide driver id",
      });
    }

    const existingDriver = prisma.driverModel.findFirst({
      where: {
        id: driverId,
      },
    });

    if (!existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver is doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: existingDriver,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching Driver details",
      error: (error as Error).message,
    });
  }
};

const getAllDriverDetails = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while adding Driver cars",
    });
  }

  try {
    const existingDrivers = prisma.driverModel.findMany({});

    if (!existingDrivers) {
      return res.status(400).json({
        success: false,
        message: "Driver is doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: existingDrivers,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching Driver details",
      error: (error as Error).message,
    });
  }
};

const updateDriver = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Driver",
    });
  }

  const parsedData = DriverSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "please enter valid car information",
      error: parsedData.error.issues,
    });
  }

  try {
    const {
      carId,
      driverName,
      phoneNumber,
      driverAddhar,
      driverPan,
      driverLicense,
    } = parsedData.data;

    const existingDriver = await prisma.driverModel.findFirst({
      where: {
        OR: [{ carModelId: carId }, { phoneNumber: phoneNumber }],
      },
    });

    if (!existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver doesn't exists",
      });
    }

    const updateDriverDetails = await prisma.driverModel.update({
      where: {
        id: existingDriver.id,
      },
      data: {
        driverName: driverName,
        phoneNumber: phoneNumber,
        driverAddhar: driverAddhar,
        driverPan: driverPan,
        driverLicense: driverLicense,
        carModelId: carId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "New Driver has been created",
      data: updateDriverDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Updating Driver",
      error: (error as Error).message,
    });
  }
};

const disableDriver = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while adding Driver cars",
    });
  }

  try {
    const { driverId, phoneNumber } = req.body;

    const existingDriver = await prisma.driverModel.findFirst({
      where: {
        OR: [{ phoneNumber: phoneNumber }, { id: driverId }],
      },
    });

    if (!existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver doesn't exists",
      });
    }

    const disabledDriver = await prisma.driverModel.update({
      where: {
        id: existingDriver.id,
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Driver has been disabled",
      data: disabledDriver,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Adding Driver",
      error: (error as Error).message,
    });
  }
};

export {
  addDriver,
  updateDriver,
  getDriver,
  getAllDriverDetails,
  disableDriver,
};
