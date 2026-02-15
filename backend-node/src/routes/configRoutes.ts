import { Router } from "express";
import { SystemConfigController } from "../controllers/SystemConfigController";
import { authMiddleware, authorize } from "../middleware/auth";

const router = Router();

router.get("/", SystemConfigController.getConfig);
router.put("/", authMiddleware, authorize(["ROLE_ADMIN"]), SystemConfigController.updateConfig);

export default router;
