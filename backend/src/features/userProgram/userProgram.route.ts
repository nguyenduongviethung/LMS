import { Router} from "express";
import { userProgramController } from "./userProgram.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.post("/", userProgramController.createUserProgram);
router.put("/:userProgramId", userProgramController.updateUserProgram);
router.delete("/:userProgramId", userProgramController.deleteUserProgram);

export default router;