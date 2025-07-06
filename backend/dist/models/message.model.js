"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
const MessageSchema = new mongoose_1.Schema({
    conversationId: mongoose_1.Types.ObjectId,
    sender: mongoose_1.Types.ObjectId,
    content: String,
    type: {
        type: String,
        enum: ["text", "image", "video", "audio", "file"],
        default: "text",
    },
    seenBy: [mongoose_1.Types.ObjectId],
    // And `Schema.Types.ObjectId` in the schema definition.
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)("message", MessageSchema);
