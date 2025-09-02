"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
const ConversationSchema = new mongoose_1.Schema({
    participants: [mongoose_1.Types.ObjectId],
    isGroup: Boolean,
    lastMessage: mongoose_1.Types.ObjectId,
}, { timestamps: true });
exports.Conversation = (0, mongoose_1.model)("conversation", ConversationSchema);
