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
} from "../controllers/idiom.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllIdioms);
router.post("/", createIdiom);
router.get("/category", getAllCategories);
router.get("/:id", getIdiomById);
router.put("/:id", updateIdiom);
router.delete("/:id", deleteIdiom);

// Voting
router.patch("/:id/like", authMiddleware, likeIdiom);
router.patch("/:id/dislike", authMiddleware, dislikeIdiom);
router.post("/:id/vote", authMiddleware, voteIdiom);

export default router;
