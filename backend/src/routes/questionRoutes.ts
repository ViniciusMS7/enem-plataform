import { Router } from "express";
import { listQuestionsBySubject, getQuestion } from "../controllers/questionController";

const router = Router();

router.get("/subject/:subjectId", listQuestionsBySubject);
router.get("/:id", getQuestion);

export default router;
