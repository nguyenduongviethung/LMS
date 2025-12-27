import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

export default router;
