import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh-token", authenticate, AuthController.refreshToken);
router.post("/logout", authenticate, AuthController.logout);
// router.post("/request-otp", AuthController.requestOtp);
// router.post("/verify-otp", AuthController.verifyOtp);

export default router;