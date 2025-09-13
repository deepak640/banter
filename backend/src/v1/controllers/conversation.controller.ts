import { NextFunction, Request, Response } from "express";
import { Conversation } from "../../models/conversation.model";
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
              photo:1,
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
            { $arrayElemAt: ["$otherUsers.photo", 0] },
            null,
          ],
        },
      },
    }
  );
  console.log("Pipeline:", JSON.stringify(pipeline, null, 2));
  const conversations = await Conversation.aggregate(pipeline).exec();
  res.json({
    conversations: conversations,
  });
};

export const getprofileByConversationId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: conversationId } = req.params;

  try {
    let pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(conversationId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $project: {
          participants: {
            _id: 1,
            name: 1,
            photo: 1,
            lastActive: 1,
          },
        },
      },
    ];
    const result = await Conversation.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      res.status(404).json({ message: "Conversation not found" });
    } else {
      res.json({
        participants: result[0].participants,
      });
    }
  } catch (error) {
    console.log("Error fetching conversation profile:", error);
    next(error);
  }
};
