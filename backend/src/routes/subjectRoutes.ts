import { Router } from "express";
import { listSubjects, setUserSubjectDifficulty } from "../controllers/subjectController";

const router = Router();

router.get("/", listSubjects);
router.post("/:subjectId/difficulty", setUserSubjectDifficulty);

export default router;
