import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppDataSource } from "../data-source";
import { BorrowRequest, BorrowStatus } from "../entities/BorrowRequest";
import { Book } from "../entities/Book";
import * as XLSX from "xlsx";

export class ReportingController {
    static async getOverdueLedger(req: AuthRequest, res: Response) {
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const overdue = await borrowRepository.find({
            where: { status: BorrowStatus.OVERDUE },
            relations: ["user", "book"]
        });
        return res.json(overdue);
    }

    static async getInventoryHeatmap(req: AuthRequest, res: Response) {
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const allRequests = await borrowRepository.find({ relations: ["book"] });

        const genreStats: Record<string, number> = {};
        allRequests.forEach(r => {
            const genre = r.book.genre;
            genreStats[genre] = (genreStats[genre] || 0) + 1;
        });

        return res.json(genreStats);
    }

    static async getAuditTrail(req: AuthRequest, res: Response) {
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const audit = await borrowRepository.find({
            where: [
                { status: BorrowStatus.APPROVED },
                { status: BorrowStatus.REJECTED },
                { status: BorrowStatus.RETURNED }
            ],
            relations: ["user", "book"],
            order: { requestDate: "DESC" }
        });
        return res.json(audit);
    }

    static async exportReport(req: AuthRequest, res: Response) {
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const allRequests = await borrowRepository.find({ relations: ["user", "book"] });

        const data = allRequests.map(r => ({
            "User": r.user.fullName,
            "Email": r.user.email,
            "Book Title": r.book.title,
            "Start Date": r.requestDate?.toISOString() || "",
            "End Date": r.dueDate?.toISOString() || "",
            "Status": r.status,
            "Fine": r.fineAmount || 0
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Library Report");

        const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=library_report.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buf);
    }
}
