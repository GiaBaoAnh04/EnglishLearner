import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../controllers/auth.controller";
import {
  uploadAvatar,
  getUserStats,
  getFavouriteIdioms,
  addToFavourites,
  removeFromFavourites,
} from "../controllers/user.controller";
import upload from "../middlewares/upload";

const router = Router();

// Lấy thông tin cá nhân
router.get("/profile", authMiddleware, getProfile);

// Cập nhật thông tin cá nhân
router.put("/profile", authMiddleware, updateProfile);

// Upload avatar
router.post(
  "/profile/avatar",
  authMiddleware,
  upload.single("avatar"), // multer field name
  uploadAvatar
);

// Lấy thống kê của user
router.get("/stats", authMiddleware, getUserStats);

// Favourite idioms
router.get("/favourites", authMiddleware, getFavouriteIdioms);
router.post("/favourites/:idiomId", authMiddleware, addToFavourites);
router.delete("/favourites/:idiomId", authMiddleware, removeFromFavourites);

export default router;
