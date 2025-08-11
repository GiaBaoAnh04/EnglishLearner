import { Router } from "express";
import {
  createIdiom,
  getAllIdioms,
  getIdiomById,
  updateIdiom,
  deleteIdiom,
  dislikeIdiom,
  likeIdiom,
  voteIdiom,
  getAllCategories,
  getUserIdioms,
} from "../controllers/idiom.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllIdioms);
router.post("/", authMiddleware, createIdiom);
router.get("/category", getAllCategories);
router.get("/my/idioms", authMiddleware, getUserIdioms);
router.get("/:id", getIdiomById);
router.put("/:id", updateIdiom);
router.delete("/:id", deleteIdiom);

// Voting
router.patch("/:id/like", authMiddleware, likeIdiom);
router.patch("/:id/dislike", authMiddleware, dislikeIdiom);
router.post("/:id/vote", authMiddleware, voteIdiom);

export default router;
