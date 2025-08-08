import { Request, Response } from "express";
import Idiom from "../models/idiom.model";
import { isValidObjectId } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createIdiom = async (req: Request, res: Response) => {
  try {
    const {
      title,
      meaning,
      example,
      explanation,
      etymology,
      category,
      difficulty,
      author,
      tags,
    } = req.body;

    // Validate required fields
    if (!title || !meaning || !example || !explanation || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const idiom = await Idiom.create({
      title,
      meaning,
      example,
      explanation,
      etymology,
      category,
      difficulty,
      author,
      tags,
      votes: [], // Mặc định không có vote khi tạo
      comments: [], // Mặc định không có comment khi tạo
    });

    res.status(201).json(idiom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create idiom", details: err });
  }
};

export const getAllIdioms = async (_req: Request, res: Response) => {
  try {
    const idioms = await Idiom.find().populate("author", "name email");
    res.json(idioms);
  } catch (err) {
    res.status(500).json({ error: "Failed to get idioms" });
  }
};

export const updateIdiom = async (req: Request, res: Response) => {
  try {
    const updated = await Idiom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Idiom not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update idiom" });
  }
};

export const deleteIdiom = async (req: Request, res: Response) => {
  try {
    const deleted = await Idiom.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Idiom not found" });
    res.json({ message: "Idiom deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete idiom" });
  }
};

// Lấy idiom bằng ID
// export const getIdiomById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!isValidObjectId(id)) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     const idiom = await Idiom.findById(id)
//       .populate({
//         path: "comments",
//         populate: [
//           {
//             path: "user",
//             select: "username",
//           },
//           {
//             path: "replies.user",
//             select: "username",
//           },
//         ],
//       })
//       .populate("author", "username email")
//       .populate("votes.user", "username");

//     if (!idiom) {
//       return res.status(404).json({ message: "Idiom not found" });
//     }

//     // Tính số lượt like và dislike
//     const upvotes = idiom.votes.filter(
//       (vote: any) => vote.voteType === "up"
//     ).length;
//     const downvotes = idiom.votes.filter(
//       (vote: any) => vote.voteType === "down"
//     ).length;

//     // Tạo response object bao gồm thông tin vote counts
//     const response = {
//       ...idiom.toObject(), // Chuyển mongoose document thành plain object
//       upvotes,
//       downvotes,
//       voteCount: upvotes - downvotes, // Thêm tổng số vote (tùy chọn)
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error getting idiom by ID:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getIdiomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const idiom = await Idiom.findById(id)
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: "username avatar", // Thêm các field cần thiết
          },
          {
            path: "replies",
            populate: {
              path: "user",
              select: "username",
            },
          },
        ],
      })
      .populate("author", "username email")
      .populate("votes.user", "username");

    if (!idiom) {
      return res.status(404).json({ message: "Idiom not found" });
    }

    // Tính toán votes
    const upvotes = idiom.votes.filter((v: any) => v.voteType === "up").length;
    const downvotes = idiom.votes.filter(
      (v: any) => v.voteType === "down"
    ).length;

    res.status(200).json({
      ...idiom.toObject(),
      upvotes,
      downvotes,
      voteCount: upvotes - downvotes,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like một idiom
export const likeIdiom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Kiểm tra và lấy userId từ req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user._id; // Đã được gán từ authMiddleware

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Kiểm tra xem user đã vote chưa
    const idiom = await Idiom.findById(id);
    if (!idiom) {
      return res.status(404).json({ message: "Idiom not found" });
    }

    const existingVoteIndex = idiom.votes.findIndex(
      (vote: any) => vote.user.toString() === userId.toString()
    );

    if (existingVoteIndex !== -1) {
      // Nếu đã vote down trước đó, chuyển sang upvote
      if (idiom.votes[existingVoteIndex].voteType === "down") {
        idiom.votes[existingVoteIndex].voteType = "up";
        await idiom.save();
        return res.status(200).json({ message: "Vote updated to up" });
      }
      // Nếu đã vote up rồi, xóa vote
      idiom.votes.splice(existingVoteIndex, 1);
      await idiom.save();
      return res.status(200).json({ message: "Vote removed" });
    }

    // Thêm vote mới
    idiom.votes.push({ user: userId, voteType: "up" });
    await idiom.save();

    res.status(200).json({ message: "Upvoted successfully" });
  } catch (error) {
    console.error("Error liking idiom:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Dislike một idiom
export const dislikeIdiom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Kiểm tra và lấy userId từ req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user._id; // Đã được gán từ authMiddleware

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Kiểm tra xem user đã vote chưa
    const idiom = await Idiom.findById(id);
    if (!idiom) {
      return res.status(404).json({ message: "Idiom not found" });
    }

    const existingVoteIndex = idiom.votes.findIndex(
      (vote: any) => vote.user.toString() === userId.toString()
    );

    if (existingVoteIndex !== -1) {
      // Nếu đã vote up trước đó, chuyển sang downvote
      if (idiom.votes[existingVoteIndex].voteType === "up") {
        idiom.votes[existingVoteIndex].voteType = "down";
        await idiom.save();
        return res.status(200).json({ message: "Vote updated to down" });
      }
      // Nếu đã vote down rồi, xóa vote
      idiom.votes.splice(existingVoteIndex, 1);
      await idiom.save();
      return res.status(200).json({ message: "Vote removed" });
    }

    // Thêm vote mới
    idiom.votes.push({ user: userId, voteType: "down" });
    await idiom.save();

    res.status(200).json({ message: "Downvoted successfully" });
  } catch (error) {
    console.error("Error disliking idiom:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Combined vote controller
export const voteIdiom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' hoặc 'down'
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const idiom = await Idiom.findById(id);
    if (!idiom) {
      return res.status(404).json({ message: "Idiom not found" });
    }

    // Tìm vote hiện tại của user
    const existingVoteIndex = idiom.votes.findIndex(
      (vote: any) => vote.user.toString() === userId.toString()
    );

    let message = "";

    if (existingVoteIndex !== -1) {
      // Nếu vote cùng loại -> xóa vote
      if (idiom.votes[existingVoteIndex].voteType === voteType) {
        idiom.votes.splice(existingVoteIndex, 1);
        message = "Vote removed";
      }
      // Nếu vote khác loại -> đổi loại vote
      else {
        idiom.votes[existingVoteIndex].voteType = voteType;
        message = `Vote changed to ${voteType}`;
      }
    } else {
      // Thêm vote mới
      idiom.votes.push({ user: userId, voteType });
      message = `${voteType === "up" ? "Liked" : "Disliked"} successfully`;
    }

    await idiom.save();

    // Tính toán upvotes và downvotes mới
    const upvotes = idiom.votes.filter((v: any) => v.voteType === "up").length;
    const downvotes = idiom.votes.filter(
      (v: any) => v.voteType === "down"
    ).length;

    res.status(200).json({
      success: true,
      message,
      data: {
        upvotes,
        downvotes,
        userVote:
          idiom.votes.find((v: any) => v.user.toString() === userId.toString())
            ?.voteType || null,
      },
    });
  } catch (error) {
    console.error("Error voting idiom:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
