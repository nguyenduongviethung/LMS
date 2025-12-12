import { Router } from "express";
import { AuthController } from "./auth.controller";

export const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
// router.post("/request-otp", AuthController.requestOtp);
// router.post("/verify-otp", AuthController.verifyOtp);
