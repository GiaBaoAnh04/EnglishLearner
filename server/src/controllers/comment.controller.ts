import { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import Idiom from "../models/idiom.model";

// Tạo comment mới
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, idiomId } = req.body;

    const comment = new Comment({
      content,
      user: req.user._id,
      idiom: idiomId,
    });

    await comment.save();
    await Idiom.findByIdAndUpdate(
      idiomId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error create comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy comments theo idiom
export const getCommentsByIdiom = async (req: Request, res: Response) => {
  try {
    const { idiomId } = req.params;
    const comments = await Comment.find({ idiom: idiomId })
      .populate("user", "username avatar")
      .populate({
        path: "replies",
        populate: { path: "user", select: "username avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Error get comments by idiom:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like/dislike comment
export const voteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { voteType } = req.body; // 'like' or 'dislike'

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    // Xử lý like
    if (voteType === "like") {
      if (likeIndex === -1) {
        comment.likes.push(userId);
        if (dislikeIndex !== -1) {
          comment.dislikes.splice(dislikeIndex, 1);
        }
      } else {
        comment.likes.splice(likeIndex, 1);
      }
    }
    // Xử lý dislike
    else if (voteType === "dislike") {
      if (dislikeIndex === -1) {
        comment.dislikes.push(userId);
        if (likeIndex !== -1) {
          comment.likes.splice(likeIndex, 1);
        }
      } else {
        comment.dislikes.splice(dislikeIndex, 1);
      }
    }

    await comment.save();
    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userVote: comment.likes.includes(userId)
        ? "like"
        : comment.dislikes.includes(userId)
        ? "dislike"
        : null,
    });
  } catch (error) {
    console.error("Error vote comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
