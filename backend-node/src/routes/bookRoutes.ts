import { Router } from "express";
import { BookController } from "../controllers/BookController";
import { authMiddleware, authorize } from "../middleware/auth";

const router = Router();

router.get("/", BookController.getAllBooks);
router.get("/genres", BookController.getAllGenres);
router.get("/:id", BookController.getBookById);

router.post("/", authMiddleware, authorize(["ROLE_ADMIN", "ROLE_LIBRARIAN"]), BookController.createBook);
router.put("/:id", authMiddleware, authorize(["ROLE_ADMIN"]), BookController.updateBook);
router.delete("/:id", authMiddleware, authorize(["ROLE_ADMIN"]), BookController.deleteBook);

export default router;
