import { Router } from "express";
import { classController } from "./class.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", classController.getClasses);
router.get("/:classId", classController.getDetailClass);
// router.get("/:classId/users", classController.getUsers);
// router.get("/:classId/sessions", classController.getSessions);
router.post("/", classController.createClass);
router.put("/:classId", classController.updateClass);
router.delete("/:classId", classController.deleteClass);

export default router;