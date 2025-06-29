import { NextFunction, Request, Response } from "express";
import { Conversation } from "models/conversation.model";
import { PipelineStage, Types } from "mongoose";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { users } = req.body;
  let isGroup = false;

  if (users.length > 2) {
    isGroup = true;
  }

  const existing = await Conversation.findOne({
    participants: { $all: users, $size: 2 },
    isGroup: isGroup,
  });

  const conversation = new Conversation({
    participants: users,
    isGroup: isGroup,
  });
  await conversation.save();
  res.json({
    id: conversation._id,
  });
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.params;
  let pipeline: PipelineStage[] = [];
  pipeline.push(
    {
      $match: {
        participants: { $in: [new Types.ObjectId(userId)] },
      },
    },
    {
      $addFields: {
        isGroup: { $ifNull: ["$isGroup", false] },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { participantIds: "$participants" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$participantIds"] },
                  { $ne: ["$_id", new Types.ObjectId(userId)] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              profile: 1,
            },
          },
        ],
        as: "otherUsers",
      },
    },
    {
      $addFields: {
        userName: {
          $cond: [
            { $eq: ["$isGroup", false] },
            { $arrayElemAt: ["$otherUsers.name", 0] },
            null,
          ],
        },
        userProfile: {
          $cond: [
            { $eq: ["$isGroup", false] },
            { $arrayElemAt: ["$otherUsers.profile", 0] },
            null,
          ],
        },
      },
    }
  );

  const conversations = await Conversation.aggregate(pipeline).exec();
  res.json({
    conversations: conversations,
  });
};
