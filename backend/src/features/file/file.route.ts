// file.controller.ts
import { Router } from "express";
import { upload } from "../../common/middlewares/upload.middleware";
import { fileController } from "./file.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.post("/", upload.single("file"), fileController.uploadFile);

export default router;
