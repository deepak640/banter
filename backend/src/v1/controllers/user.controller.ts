import { User } from "models/user.model";
import { NextFunction, Request, Response } from "express";
import { comparePassword, encryptPassword } from "helpers/bcrypt";
import { GenerateToken } from "helpers/jwt";
import { generateUniqueCode } from "helpers/unqiueCode";
import mongoose, { PipelineStage } from "mongoose";

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

