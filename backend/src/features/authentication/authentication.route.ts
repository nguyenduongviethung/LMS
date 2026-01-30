import { Router } from "express";
import { AuthenticationController } from "./authentication.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post("/login", AuthenticationController.login);
router.post("/refresh-token", AuthenticationController.refreshToken);

router.use(authenticate);
router.get("/me", AuthenticationController.me);
router.post("/register", AuthenticationController.register);
router.post("/logout", AuthenticationController.logout);

export default router;