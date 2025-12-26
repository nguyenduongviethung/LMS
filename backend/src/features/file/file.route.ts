// file.controller.ts
import { Router } from "express";
import { upload } from "../../common/middlewares/upload.middleware";
import { fileController } from "./file.controller";

const router = Router();

router.post("/", upload.single("file"), fileController.uploadFile);

export default router;
