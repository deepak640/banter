"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_routes_1 = __importDefault(require("v1/routes/user.routes"));
const conversation_routes_1 = __importDefault(require("v1/routes/conversation.routes"));
const message_routes_1 = __importDefault(require("v1/routes/message.routes"));
router.use("/users", user_routes_1.default);
router.use("/conversations", conversation_routes_1.default);
router.use("/messages", message_routes_1.default);
exports.default = router;
