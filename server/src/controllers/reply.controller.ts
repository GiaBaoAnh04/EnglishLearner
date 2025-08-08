import { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Reply } from "../models/reply.model";

export const createReply = async (req: AuthRequest, res: Response) => {
  try {
    const { content, commentId } = req.body;

    const reply = new Reply({
      content,
      user: req.user._id,
      comment: commentId,
    });

    await reply.save();

    // Thêm reply vào comment
    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error("Error create reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const voteReply = async (req: AuthRequest, res: Response) => {
  try {
    const { replyId } = req.params;
    const { voteType } = req.body; // 'like' or 'dislike'

    // 1. Tìm reply trong database
    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const userId = req.user._id;
    const likeIndex = reply.likes.indexOf(userId);
    const dislikeIndex = reply.dislikes.indexOf(userId);

    // 2. Xử lý vote
    if (voteType === "like") {
      // Nếu chưa like
      if (likeIndex === -1) {
        reply.likes.push(userId);
        // Nếu đang dislike thì xóa dislike
        if (dislikeIndex !== -1) {
          reply.dislikes.splice(dislikeIndex, 1);
        }
      } else {
        // Nếu đã like thì bỏ like
        reply.likes.splice(likeIndex, 1);
      }
    } else if (voteType === "dislike") {
      // Nếu chưa dislike
      if (dislikeIndex === -1) {
        reply.dislikes.push(userId);
        // Nếu đang like thì xóa like
        if (likeIndex !== -1) {
          reply.likes.splice(likeIndex, 1);
        }
      } else {
        // Nếu đã dislike thì bỏ dislike
        reply.dislikes.splice(dislikeIndex, 1);
      }
    }

    // 3. Lưu thay đổi
    await reply.save();

    // 4. Trả về kết quả
    res.status(200).json({
      success: true,
      data: {
        likes: reply.likes.length,
        dislikes: reply.dislikes.length,
        userVote: reply.likes.includes(userId)
          ? "like"
          : reply.dislikes.includes(userId)
          ? "dislike"
          : null,
      },
    });
  } catch (error) {
    console.error("Error voting reply:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
