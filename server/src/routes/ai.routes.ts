import { Router } from "express";
import { generateIdiomData } from "../controllers/ai.controller";

const router = Router();

router.post("/generate-idiom", generateIdiomData);

export default router;
