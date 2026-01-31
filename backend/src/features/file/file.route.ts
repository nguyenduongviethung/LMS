import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";
import { fileController } from "./file.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.use(authenticate);

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/:fileId/download", fileController.downloadFile);
router.get("/:fileId/download", fileController.downloadFile);
router.post("/link", fileController.createLink);

export default router;
