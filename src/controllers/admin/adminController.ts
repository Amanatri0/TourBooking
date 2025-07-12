import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { UpdateUserRoleSchema } from "../../zodTypes/forAdmin/zodAdmin";

const prisma = new PrismaClient();

// only admin can see all the users
const getAllUserDetails = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching all user details",
    });
  }

  try {
    const allUsersData = await prisma.userModel.findMany({
      where: {
        id: { not: adminId },
      },
    });

    res.status(200).json({
      success: true,
      message: "All the users data are fetched",
      data: allUsersData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Fetching all user details",
      error: (error as Error).message,
    });
  }
};

// if admin wants to update user to admin/sub-admin
const updateUserRole = async (req: Request, res: Response) => {
  const adminId = req.userId;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong fetching admin",
    });
  }

  const parsedData = UpdateUserRoleSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please enter valid information, while signing",
      success: false,
    });
  }
  try {
    const { id, email, newRole } = parsedData.data;

    const existingUser = await prisma.userModel.findFirst({
      where: {
        id: id,
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "User doesn't exist",
        success: false,
      });
    }

    const updateUserRole = await prisma.userModel.update({
      where: {
        id: existingUser.id,
      },
      data: {
        role: newRole,
      },
    });

    if (!updateUserRole) {
      return res.status(400).json({
        message: "unable to updated user role",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role has been updated successfully",
      data: updateUserRole,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating user role",
      error: (error as Error).message,
    });
  }
};

export { getAllUserDetails, updateUserRole };
