import { Router } from "express";
import { submitAttempt, getQuestionsForReview } from "../controllers/attemptController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", requireAuth, submitAttempt);
router.get("/review", requireAuth, getQuestionsForReview);

export default router;
