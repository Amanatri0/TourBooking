import dotenv from "dotenv";

dotenv.config();
import { Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const STORAGE_ZONE = process.env.STORAGE_ZONE;
const FOLDER = process.env.FOLDER;
const CDN_URL = process.env.CDN_URL!;

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
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
      maxBodyLength: Infinity,
    } as any);

    const publicUrl = `${CDN_URL}/${FOLDER}/${fileName}`;

    // Save the URL in MongoDB using Prisma (adapt this to your schema)
    const savedImage = await prisma.imageModel.create({
      data: {
        imageUrl: publicUrl,
      },
    });

    return res.status(201).json({
      message: "Image uploaded successfully",
      data: savedImage,
    });
  } catch (err: any) {
    console.error("Upload error:", err.message);
    return res.status(500).json({ message: "Failed to upload image" });
  }
};
