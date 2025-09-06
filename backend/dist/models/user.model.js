"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
const UserSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    password: String,
    lastActive: Date,
    photo: String,
    hashId: String,
    // And `Schema.Types.ObjectId` in the schema definition.
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", UserSchema);
