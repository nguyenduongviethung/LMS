import { Router} from "express";
import { programController } from "./program.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", programController.getPrograms);
router.post("/", programController.createProgram);
router.put("/:id", programController.updateProgram);
router.delete("/:id", programController.deleteProgram);
