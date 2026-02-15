import { Router } from "express";
import { ReportingController } from "../controllers/ReportingController";
import { authMiddleware, authorize } from "../middleware/auth";

const router = Router();

router.get("/overdue", authMiddleware, authorize(["ROLE_ADMIN", "ROLE_LIBRARIAN"]), ReportingController.getOverdueLedger);
router.get("/inventory-heatmap", authMiddleware, authorize(["ROLE_ADMIN", "ROLE_LIBRARIAN"]), ReportingController.getInventoryHeatmap);
router.get("/audit-trail", authMiddleware, authorize(["ROLE_ADMIN"]), ReportingController.getAuditTrail);
router.get("/export", authMiddleware, authorize(["ROLE_ADMIN", "ROLE_LIBRARIAN"]), ReportingController.exportReport);

export default router;
