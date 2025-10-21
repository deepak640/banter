import { User } from "../../models/user.model";
import { NextFunction, Request, Response } from "express";
import { comparePassword, encryptPassword } from "../../helpers/bcrypt";
import { GenerateToken } from "../../helpers/jwt";
import { generateUniqueCode } from "../../helpers/unqiueCode";
import mongoose, { PipelineStage } from "mongoose";
import cloudinary from "../../config/cloudinary.config";
import extractPublicId from "../../helpers/extractPublicId";

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
      success: true,
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
    let matchObj = {};

    if (req.query.search) {
      const search = req.query.search as string;
      matchObj = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    pipeline.push({
      $lookup: {
        from: "conversations",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$$userId", "$participants"] }, // candidate user is in participants
                  {
                    $in: [
                      new mongoose.Types.ObjectId(req.query.userId as string),
                      "$participants",
                    ],
                  }, // logged-in user also in participants
                  { $eq: ["$isGroup", false] }, // only 1-on-1 chats
                ],
              },
            },
          },
        ],
        as: "conversations",
      },
    });

    pipeline.push({
      $match: {
        ...matchObj,
        conversations: { $size: 0 }, // only users with no existing conversation
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
    console.log(JSON.stringify(req.body), null, 2);
    const user = await User.findById(id);
    if (!user && !req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
    }
    console.log("user", user);
    if (user?.photo && req.file) {
      const publicId = extractPublicId(user.photo);
      await cloudinary.uploader.destroy(publicId);
    }
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req?.file?.path, {
        folder: "uploads",
      });
      req.body.photo = result.secure_url;
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
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
