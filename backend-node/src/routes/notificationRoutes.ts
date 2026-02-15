import { Router } from "express";
import { UserNotificationController } from "../controllers/UserNotificationController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/my", authMiddleware, UserNotificationController.getMyNotifications);
router.put("/:id/read", authMiddleware, UserNotificationController.markAsRead);

export default router;
