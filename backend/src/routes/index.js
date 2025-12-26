import { Router } from "express";
import userRoute from "../features/user/user.route";
import authRoute from "../features/auth/auth.route";
import classRoute from "../features/class/class.route";
import userClassRoute from "../features/userClass/userClass.route";
import fileRoute from "../features/file/file.route";

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/class", classRoute);
router.use("/user-class", userClassRoute);
router.use("/files", fileRoute);

export default router;
