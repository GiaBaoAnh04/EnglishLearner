import express from "express";
import {
  createComment,
  getCommentsByIdiom,
  voteComment,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.get("/:idiomId", getCommentsByIdiom);
router.post("/:commentId/vote", authMiddleware, voteComment);

export default router;
