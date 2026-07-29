import { Router } from "express";
import { generateWeeklyPlan, getPlanByWeek } from "../controllers/studyPlanController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/generate", requireAuth, generateWeeklyPlan);
router.get("/user", requireAuth, getPlanByWeek);

export default router;
