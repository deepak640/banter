import { User } from "models/user.model";
import { NextFunction, Request, Response } from "express";
import { comparePassword, encryptPassword } from "helpers/bcrypt";
import { GenerateToken } from "helpers/jwt";
import { generateUniqueCode } from "helpers/unqiueCode";
import mongoose, { PipelineStage } from "mongoose";
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_URI
);
const containerClient = blobServiceClient.getContainerClient("uploads"); // Replace with your container name

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    let user, encryptedPassword;
    req.body.hashId = `user-${generateUniqueCode()}`;
    user = await User.findOne({ email }).exec();
    if (user) {
      throw new Error("User already exists");
    }
    encryptedPassword = await encryptPassword(password);
    user = new User({
      ...req.body,
      password: encryptedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    let Existuser, checkPassword, JWTtoken;

    Existuser = await User.findOne({ email }).lean();
    if (!Existuser) {
      throw new Error("User does not exist");
    }
    checkPassword = await comparePassword(Existuser.password, password);
    if (!checkPassword) {
      throw new Error("Invalid password");
    }

    JWTtoken = await GenerateToken(Existuser);

    res.status(200).json({
      user: {
        _id: Existuser._id,
        hashId: Existuser.hashId,
      },
      token: JWTtoken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: {
        _id: {
          $ne:
            typeof req.query.userId === "string"
              ? new mongoose.Types.ObjectId(req.query.userId)
              : null,
        },
      },
    });
    const user = await User.aggregate(pipeline);
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let updateData = req.body;
    if ((req as any).file) {
      const photo = (req as any).file;
      const blobName = `profile-${Date.now()}.jpg`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload the file to Azure Blob Storage
      await blockBlobClient.upload(photo.buffer, photo.size);
      updateData.photo = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerClient.containerName}/${blobName}`;
    }

    console.log(updateData, "||new");
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
