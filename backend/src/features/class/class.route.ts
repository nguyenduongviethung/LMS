import { Router } from "express";
import { classController } from "./class.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.get("/", authenticate, classController.getClasses);
router.post("/", authenticate, classController.createClass);
router.put("/:id", authenticate, classController.updateClass);
router.delete("/:id", authenticate, classController.deleteClass);

export default router;