import { Router } from "express";
import { contentController } from "./content.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.post("/", authenticate, contentController.createContent);
router.put("/:id", authenticate, contentController.updateContent);