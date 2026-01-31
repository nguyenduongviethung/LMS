import { Router } from "express";
import { contentController } from "./content.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.post("/", contentController.createContent);
router.put("/:contentId", contentController.updateContent);
router.put("/:contentId/users/:userId/task-result", contentController.updateTaskResult);

export default router;