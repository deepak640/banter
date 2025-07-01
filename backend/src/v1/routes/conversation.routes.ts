import express from "express";
import {
  createConversation,
  getConversations,
  getprofileByConversationId,
} from "../controllers/conversation.controller";
const router = express.Router();

router.post("/", createConversation);

router.get("/:id", getConversations);
router.get("/profile/:id", getprofileByConversationId);
export default router;
