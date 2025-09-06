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
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const v1_routes_1 = __importDefault(require("v1/v1.routes"));
const connection_1 = __importDefault(require("./db/connection"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_middleware_1 = require("middlewares/errorHandler.middleware");
const http_errors_1 = __importDefault(require("http-errors"));
const conversation_model_1 = require("models/conversation.model");
const mongoose_1 = require("mongoose");
const user_model_1 = require("models/user.model");
const message_model_1 = require("models/message.model");
(0, connection_1.default)();
// Initialize express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const PORT = parseInt(process.env.PORT || "4000", 10);
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// CORS middleware
app.use(((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
}));
// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running successfully",
        status: "OK",
    });
});
app.use("/v1", v1_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        status: "ERROR",
    });
});
// Error handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        status: "ERROR",
        message: error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
});
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(errorHandler_middleware_1.errorHandler);
const onlineUsers = new Map();
// Socket.IO event handlers
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, conversationId } = socket.handshake.query;
    // Check if conversationId is a valid MongoDB ObjectId
    if (!mongoose_1.Types.ObjectId.isValid(conversationId)) {
        const errorMsg = `Invalid conversationId: ${conversationId}`;
        socket.emit("error", { message: errorMsg });
        socket.disconnect();
        return;
    }
    const conversation = yield conversation_model_1.Conversation.findOne({
        _id: conversationId,
        participants: { $in: [userId] },
    });
    if (!conversation) {
        const errorMsg = `Socket ${socket.id} tried to join conversation ${conversationId} but is not a participant`;
        socket.emit("error", { message: errorMsg });
        socket.disconnect();
        return;
    }
    if (conversationId) {
        socket.join(conversationId);
        onlineUsers.set(userId, socket.id);
        // Notify others in the room that this user is online
        io.to(conversationId).emit("user-status", {
            userId,
            status: true,
        });
        // Check the status of the other user in the conversation and notify the current user
        const otherUser = conversation.participants.find((p) => p.toString() !== userId);
        if (otherUser && onlineUsers.has(otherUser.toString())) {
            socket.emit("user-status", {
                userId: otherUser.toString(),
                status: true,
            });
        }
    }
    socket.on("send-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new message_model_1.Message({
            conversationId: data.conversationId,
            content: data.text,
            sender: userId,
        });
        yield message.save();
        io.to(data.conversationId).emit("receive-message", data);
    }));
    // Listen for typing events
    socket.on("typing-start", (data) => {
        socket.to(data.conversationId).emit("typing-start-notification", {
            hashId: data.hashId,
        });
    });
    socket.on("typing-stop", (data) => {
        socket.to(data.conversationId).emit("typing-stop-notification", {
            hashId: data.hashId,
        });
    });
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Client disconnected: ${socket.id}`);
        if (userId) {
            onlineUsers.delete(userId);
            const lastActive = new Date();
            yield user_model_1.User.findOneAndUpdate({ _id: userId }, { lastActive });
            io.to(conversationId).emit("user-status", {
                userId,
                status: false,
                lastActive,
            });
        }
    }));
}));
// Join a room with conversationId
// Start server with HTTP server instead of Express
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with Socket.IO support`);
});
exports.default = app; // Export the Express app for use in other modules
