import { Router } from "express";
import { listSubjects, setUserSubjectDifficulty } from "../controllers/subjectController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, listSubjects);
router.post("/:subjectId/difficulty", requireAuth, setUserSubjectDifficulty);

export default router;
