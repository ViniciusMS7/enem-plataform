import { Router } from "express";
import { submitAttempt } from "../controllers/attemptController";

const router = Router();

router.post("/", submitAttempt);

export default router;
