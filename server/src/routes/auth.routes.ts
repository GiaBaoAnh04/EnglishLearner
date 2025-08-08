import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../utils/validation.util";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", validateRegister, handleValidationErrors, register);
router.post("/login", validateLogin, handleValidationErrors, login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
