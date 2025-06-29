import express from "express";
const router = express.Router();

import userRouter from "v1/routes/user.routes";
import conversationRouter from "v1/routes/conversation.routes";
router.use("/users", userRouter);
router.use("/conversations", conversationRouter);
export default router;
