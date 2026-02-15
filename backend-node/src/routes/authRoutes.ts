import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/signin", AuthController.signin);
router.post("/signup", AuthController.signup);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/google", AuthController.googleLogin);

export default router;
