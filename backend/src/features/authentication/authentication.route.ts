import { Router } from "express";
import { AuthenticationController } from "./authentication.controller";
import { authenticate } from "../../common/middlewares/authenticate";

const router = Router();

router.post("/login", AuthenticationController.login, authenticate);

router.use(authenticate);
router.get("/me", AuthenticationController.me);
router.post("/register", AuthenticationController.register);
router.post("/refresh-token", AuthenticationController.refreshToken);
router.post("/logout", AuthenticationController.logout);
// router.post("/request-otp", AuthenticationController.requestOtp);
// router.post("/verify-otp", AuthenticationController.verifyOtp);

export default router;