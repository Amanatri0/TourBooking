declare global {
  namespace Express {
    interface Request {
      carImageUrl?: string;
    }
  }
}

import dotenv from "dotenv";

dotenv.config();
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import path from "path";
import multer from "multer";

const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const STORAGE_ZONE = process.env.STORAGE_ZONE;
const FOLDER = process.env.FOLDER;
const CDN_URL = process.env.CDN_URL!;

const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

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

    // Save the URL in MongoDB using Prisma (adapt this to your schema)

    req.carImageUrl = publicUrl;

    next();
  } catch (err: any) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Max allowed size is 10 MB.",
        });
      }
    }
    console.error("Upload error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};

const deleteImages = async (req: Request, res: Response) => {};

export { uploadImages };
