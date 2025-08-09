import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password.util";
import { generateToken } from "../utils/jwt.util";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth.types";

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (
  req: Request<{}, AuthResponse, RegisterRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { email, password, username, fullName } = req.body;

    if (!email || !password || !username || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password too short" });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      username,
      fullName,
      createBy: new mongoose.Types.ObjectId(), // Temporary, will be updated after save
    });

    // Set createBy to user's own ID after creation
    user.createBy = user._id;
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar || null,
          role: user.role,
          level: user.level,
          streak: user.streak,
          totalPoints: user.totalPoints,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (
  req: Request<{}, AuthResponse, LoginRequest>,
  res: Response<AuthResponse>
) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login and streak
    user.lastLoginAt = new Date();

    // Simple streak logic - can be enhanced later
    const today = new Date();
    const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null;

    if (lastLogin) {
      const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar || null,
          role: user.role,
          level: user.level,
          streak: user.streak,
          totalPoints: user.totalPoints,
          // isActive: user.isActive,
          // emailVerified: user.emailVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: {
          _id: user!._id.toString(),
          email: user!.email,
          username: user!.username,
          fullName: user!.fullName,
          avatar: user!.avatar || null,
          role: user!.role,
          level: user!.level,
          streak: user!.streak,
          totalPoints: user!.totalPoints,
          lastLoginAt: user!.lastLoginAt,
          isActive: user!.isActive,
          emailVerified: user!.emailVerified,
          createdAt: user!.createdAt,
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
    const { fullName, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(fullName && { fullName }),
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
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
};
