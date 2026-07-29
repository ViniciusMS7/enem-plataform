import { Router } from "express";
import { register, login } from "../controllers/authController";
import { getUserProfile } from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, getUserProfile);

export default router;
