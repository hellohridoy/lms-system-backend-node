import { Router } from "express";
import { BorrowRequestController } from "../controllers/BorrowRequestController";
import { authMiddleware, authorize } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, authorize(["ROLE_ADMIN", "ROLE_LIBRARIAN"]), BorrowRequestController.getAllRequests);
router.get("/my", authMiddleware, BorrowRequestController.getMyRequests);
router.post("/request/:bookId", authMiddleware, BorrowRequestController.requestBook);
router.post("/renew/:id", authMiddleware, BorrowRequestController.requestRenewal);
router.put("/:id/review", authMiddleware, authorize(["ROLE_LIBRARIAN"]), BorrowRequestController.librarianReview);
router.put("/:id/approve", authMiddleware, authorize(["ROLE_ADMIN"]), BorrowRequestController.adminApprove);
router.get("/my-history", authMiddleware, BorrowRequestController.getMyHistory);
router.get("/stats", authMiddleware, BorrowRequestController.getDashboardStats);
router.post("/:id/pay", authMiddleware, BorrowRequestController.payFine);
router.put("/users/:userId/status", authMiddleware, authorize(["ROLE_ADMIN"]), BorrowRequestController.toggleUserStatus);
router.get("/users", authMiddleware, authorize(["ROLE_ADMIN"]), BorrowRequestController.getAllUsers);

export default router;
