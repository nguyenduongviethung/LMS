import { Router } from "express";
import { contentController } from "./content.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.post("/", contentController.createContent);
router.put("/:id", contentController.updateContent);