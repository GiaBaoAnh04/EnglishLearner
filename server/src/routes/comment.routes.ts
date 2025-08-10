import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByIdiom,
  updateComment,
  voteComment,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.get("/:idiomId", getCommentsByIdiom);
router.post("/:commentId/vote", authMiddleware, voteComment);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
