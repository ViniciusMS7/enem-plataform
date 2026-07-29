import { Router } from "express";
import { getProgressByUser } from "../controllers/progressController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/user", requireAuth, getProgressByUser);

export default router;
