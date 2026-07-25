import { Router } from "express";
import { generateWeeklyPlan, getPlanByWeek } from "../controllers/studyPlanController";

const router = Router();

router.post("/generate", generateWeeklyPlan);
router.get("/user/:userId", getPlanByWeek);

export default router;
