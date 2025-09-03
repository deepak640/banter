"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getprofileByConversationId = exports.getConversations = exports.createConversation = void 0;
const conversation_model_1 = require("models/conversation.model");
const mongoose_1 = require("mongoose");
const createConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { users } = req.body;
    let isGroup = false;
    if (users.length > 2) {
        isGroup = true;
    }
    const existing = yield conversation_model_1.Conversation.findOne({
        participants: { $all: users, $size: 2 },
        isGroup: isGroup,
    });
    const conversation = new conversation_model_1.Conversation({
        participants: users,
        isGroup: isGroup,
    });
    yield conversation.save();
    res.json({
        id: conversation._id,
    });
});
exports.createConversation = createConversation;
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    let pipeline = [];
    pipeline.push({
        $match: {
            participants: { $in: [new mongoose_1.Types.ObjectId(userId)] },
        },
    }, {
        $addFields: {
            isGroup: { $ifNull: ["$isGroup", false] },
        },
    }, {
        $lookup: {
            from: "users",
            let: { participantIds: "$participants" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $in: ["$_id", "$$participantIds"] },
                                { $ne: ["$_id", new mongoose_1.Types.ObjectId(userId)] },
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
    }, {
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
    });
    const conversations = yield conversation_model_1.Conversation.aggregate(pipeline).exec();
    res.json({
        conversations: conversations,
    });
});
exports.getConversations = getConversations;
const getprofileByConversationId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: conversationId } = req.params;
    try {
        let pipeline = [
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(conversationId),
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
                        profile: 1,
                        status: 1,
                    },
                },
            },
        ];
        const result = yield conversation_model_1.Conversation.aggregate(pipeline).exec();
        if (!result || result.length === 0) {
            res.status(404).json({ message: "Conversation not found" });
        }
        else {
            res.json({
                participants: result[0].participants,
            });
        }
    }
    catch (error) {
        console.log("Error fetching conversation profile:", error);
        next(error);
    }
});
exports.getprofileByConversationId = getprofileByConversationId;
