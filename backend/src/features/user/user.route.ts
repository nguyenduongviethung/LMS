import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();
router.get("/", authenticate, userController.getUsers);
router.post("/", authenticate, userController.createUser);
router.put("/:userId", authenticate, userController.updateUser);
router.delete("/:userId", authenticate, userController.deleteUser);

export default router;
