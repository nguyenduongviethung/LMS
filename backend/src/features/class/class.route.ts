import { Router } from "express";
import { classController } from "./class.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", classController.getClasses);
router.post("/", classController.createClass);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);

export default router;