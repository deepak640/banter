import type { Request, Response, NextFunction, Application } from "express";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import v1Router from "v1/v1.routes";
import connectDB from "./db/connection";
import cors from "cors";
import logger from "morgan";
import { errorHandler } from "middlewares/errorHandler.middleware";
// Define an interface for Error objects with optional status code
interface AppError extends Error {
  statusCode?: number;
}
import createError from "http-errors";
import { Conversation } from "models/conversation.model";
import mongoose, { Types } from "mongoose";
import { User } from "models/user.model";
import { Message } from "models/message.model";

connectDB();

// Initialize express app
const app: Application = express();
app.use(cors());

app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT: number = parseInt(process.env.PORT || "4000", 10);

// Track connected users
interface User {
  id: string;
  username: string;
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// CORS middleware
app.use(((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
}) as (req: Request, res: Response, next: NextFunction) => void);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running successfully",
    status: "OK",
  });
});

app.use("/v1", v1Router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
    status: "ERROR",
  });
});

// Error handling middleware
app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    status: "ERROR",
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
});
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

// Socket.IO event handlers
io.on("connection", async (socket: Socket) => {
  const { userId, conversationId } = socket.handshake.query;

  // Check if conversationId is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(conversationId as string)) {
    const errorMsg = `Invalid conversationId: ${conversationId}`;
    socket.emit("error", { message: errorMsg });
    socket.disconnect();
    return;
  }

  const check = await Conversation.findOne({
    _id: conversationId,
    participants: { $in: [userId] },
  });
  if (!check) {
    const errorMsg = `Socket ${socket.id} tried to join conversation ${conversationId} but is not a participant`;
    socket.emit("error", { message: errorMsg });
    socket.disconnect();
  }
  if (conversationId) {
    socket.join(conversationId);
    await User.updateOne({ _id: userId }, { status: true });
  }

  // ✅ Correct: Listen on the socket, not io
  type MessageData = { conversationId: string; text: string; hashId: string };

  socket.on("send-message", async (data: MessageData) => {
    // Emit the message only to the room with the given conversationId
    // Save the message to the database
    const message = new Message({
      conversationId: data.conversationId,
      content: data.text,
      sender: userId,
    });
    await message.save();
    io.to(data.conversationId).emit("receive-message", data);
  });

  // Listen for typing events
  socket.on("typing-start", (data: MessageData) => {
    // Broadcast to others in the room that a user is typing
    socket.to(data.conversationId).emit("typing-start-notification", {
      hashId: data.hashId,
    });
  });

  socket.on("typing-stop", (data: MessageData) => {
    // Broadcast to others in the room that a user has stopped typing
    socket.to(data.conversationId).emit("typing-stop-notification", {
      hashId: data.hashId,
    });
  });

  socket.on("disconnect", async () => {
    console.log(`Client disconnected: ${socket.id}`);
    if (userId) {
      await User.findOneAndUpdate({ _id: userId }, { status: false });
    }
  });
});
// Join a room with conversationId

// Start server with HTTP server instead of Express
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} with Socket.IO support`);
// });

export default app; // Export the Express app for use in other modules
