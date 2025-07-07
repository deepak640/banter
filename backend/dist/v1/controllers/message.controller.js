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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = void 0;
const message_model_1 = require("models/message.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const messages = yield message_model_1.Message.aggregate([
            {
                $match: {
                    conversationId: new mongoose_1.default.Types.ObjectId(conversationId),
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
    }
    catch (error) {
        next(error);
    }
});
exports.getAllMessages = getAllMessages;
