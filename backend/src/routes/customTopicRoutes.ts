import { Router } from "express";
import {
  searchTopic,
  getTopicById,
  addTopicForUser,
  removeTopicForUser,
  getMyTopics,
} from "../controllers/customTopicController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);

router.post("/search", searchTopic);
router.get("/mine", getMyTopics);
router.get("/:id", getTopicById);
router.post("/:id/add", addTopicForUser);
router.post("/:id/remove", removeTopicForUser);

export default router;
