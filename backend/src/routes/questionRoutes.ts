import { Router } from "express";
import { listQuestionsBySubject, getQuestion } from "../controllers/questionController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/subject/:subjectId", listQuestionsBySubject);
router.get("/:id", getQuestion);

export default router;
