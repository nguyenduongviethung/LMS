import { Router } from "express";
import userRoute from "../features/user/user.route";
import authRoute from "../features/auth/auth.route";

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);

export default router;
