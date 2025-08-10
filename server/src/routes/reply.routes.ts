import express from "express";
import {
  createReply,
  deleteReply,
  updateReply,
  voteReply,
} from "../controllers/reply.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createReply);
router.post("/:replyId/vote", authMiddleware, voteReply);
router.put("/:replyId", authMiddleware, updateReply);
router.delete("/:replyId", authMiddleware, deleteReply);
export default router;
