import express from "express";
import {
  createConversation,
  getConversations,
} from "v1/controllers/conversation.controller";
const router = express.Router();

router.post("/", createConversation);
router.get("/:id", getConversations);

export default router;
