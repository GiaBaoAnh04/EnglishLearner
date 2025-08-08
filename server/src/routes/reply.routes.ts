import express from "express";
import { createReply, voteReply } from "../controllers/reply.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createReply);
router.post("/:replyId/vote", authMiddleware, voteReply);

export default router;
