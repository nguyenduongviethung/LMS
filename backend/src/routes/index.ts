import { Router } from "express";
import userRoute from "../features/user/user.route";
import authenticationRoute from "../features/authentication/authentication.route";
import classRoute from "../features/class/class.route";
import userClassRoute from "../features/userClass/userClass.route";
import sessionRoute from "../features/session/session.route";
import contentRoute from "../features/content/content.route";
import sessionContentRoute from "../features/sessionContent/sessionContent.route";
import fileRoute from "../features/file/file.route";

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authenticationRoute);
router.use("/classes", classRoute);
router.use("/sessions", sessionRoute);
router.use("/contents", contentRoute)
router.use("/session-contents", sessionContentRoute);
router.use("/user-classes", userClassRoute);
router.use("/files", fileRoute);

export default router;
