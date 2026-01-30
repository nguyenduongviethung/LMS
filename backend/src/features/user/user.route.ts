import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", userController.getUsers);
router.get("/me", userController.getMe);
router.get("/:userId", userController.getDetailUser);
router.get("/:userId/classes", userController.getClasses);
router.post("/", userController.createUser);
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

export default router;
