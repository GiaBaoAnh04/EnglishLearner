// controllers/userController.ts
import { Response } from "express";
import User from "../models/user.model";
import Idiom from "../models/idiom.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const totalIdioms = await Idiom.countDocuments({ createdBy: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userIdioms = await Idiom.find({ createdBy: userId });
    const totalLikes = userIdioms.reduce(
      (sum, idiom) => sum + (idiom.votes?.length || 0),
      0
    );

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar || null,
          bio: user.bio || null,
          role: user.role,
          level: user.level,
          streak: user.streak,
          totalPoints: user.totalPoints,
          lastLoginAt: user.lastLoginAt,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt, // createdAt của mongoose
          registeredAt: user.createAt, // từ AuditSchema
          totalIdioms,
          totalLikes,
          favouriteIdioms: user.favouriteIdioms || [],
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting profile",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, fullName, bio, avatar } = req.body;

    // Validation
    if (username && (username.length < 3 || username.length > 50)) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3-50 characters",
      });
    }

    if (fullName && fullName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Full name must be less than 50 characters",
      });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bio must be less than 500 characters",
      });
    }

    // Kiểm tra username unique nếu có thay đổi
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username && { username }),
        ...(fullName && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          _id: user!._id.toString(),
          email: user!.email,
          username: user!.username,
          fullName: user!.fullName,
          avatar: user!.avatar || null,
          bio: user!.bio || null,
          role: user!.role,
          level: user!.level,
          streak: user!.streak,
          totalPoints: user!.totalPoints,
          isActive: user!.isActive,
          emailVerified: user!.emailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
  }
};

export const addToFavourites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { idiomId } = req.params;

    // Kiểm tra idiom có tồn tại không
    const idiom = await Idiom.findById(idiomId);
    if (!idiom) {
      return res.status(404).json({
        success: false,
        message: "Idiom not found",
      });
    }

    // Kiểm tra đã favourite chưa
    const user = await User.findById(userId);
    if (user!.favouriteIdioms.includes(idiomId as any)) {
      return res.status(400).json({
        success: false,
        message: "Idiom already in favourites",
      });
    }

    // Thêm vào favourites
    await User.findByIdAndUpdate(userId, {
      $push: { favouriteIdioms: idiomId },
    });

    res.json({
      success: true,
      message: "Added to favourites successfully",
      data: {},
    });
  } catch (error) {
    console.error("Add to favourites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding to favourites",
    });
  }
};

export const removeFromFavourites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { idiomId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { favouriteIdioms: idiomId },
    });

    res.json({
      success: true,
      message: "Removed from favourites successfully",
      data: {},
    });
  } catch (error) {
    console.error("Remove from favourites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error removing from favourites",
    });
  }
};

export const getFavouriteIdioms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "favouriteIdioms",
      populate: {
        path: "author",
        select: "fullName username",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Format data để phù hợp với frontend
    const favouriteIdioms = user.favouriteIdioms.map((idiom: any) => ({
      _id: idiom._id,
      title: idiom.title,
      meaning: idiom.meaning,
      example: idiom.example,
      explanation: idiom.explanation,
      difficulty: idiom.difficulty,
      category: idiom.category,
      votes: idiom.votes || [],
      comments: idiom.comments || [],
      createdAt: idiom.createdAt,
      author: {
        fullName: idiom.createdBy?.fullName || "Unknown",
      },
      isLiked: true,
    }));

    res.json({
      success: true,
      message: "Favourite idioms retrieved successfully",
      data: favouriteIdioms,
    });
  } catch (error) {
    console.error("Get favourites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting favourite idioms",
    });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user._id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Cập nhật avatar trong database
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { avatarUrl },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Server error uploading avatar",
    });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const [user, totalIdioms] = await Promise.all([
      User.findById(userId),
      Idiom.countDocuments({ createdBy: userId }),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Tính toán stats từ idioms của user
    const userIdioms = await Idiom.find({ createdBy: userId });
    const totalVotes = userIdioms.reduce(
      (sum, idiom) => sum + (idiom.votes?.length || 0),
      0
    );
    const totalComments = userIdioms.reduce(
      (sum, idiom) => sum + (idiom.comments?.length || 0),
      0
    );

    const stats = {
      totalIdioms,
      totalVotes,
      totalComments,
      level: user.level,
      streak: user.streak,
      totalPoints: user.totalPoints,
      favouriteCount: user.favouriteIdioms?.length || 0,
    };

    res.json({
      success: true,
      message: "User stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting user stats",
    });
  }
};
