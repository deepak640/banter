import { NextFunction, Request, Response } from "express";
import { Message } from "models/message.model";
import mongoose from "mongoose";

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.aggregate([
      {
        $match: {
          conversationId: new mongoose.Types.ObjectId(conversationId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderInfo",
        },
      },
      {
        $unwind: "$senderInfo",
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          text: "$content",
          conversationId: 1,
          createdAt: 1,
          hashId: "$senderInfo.hashId",
        },
      },
    ]);

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
