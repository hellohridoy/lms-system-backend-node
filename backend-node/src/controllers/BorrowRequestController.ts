import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppDataSource } from "../data-source";
import { BorrowRequest, BorrowStatus } from "../entities/BorrowRequest";
import { User, UserRole } from "../entities/User";
import { Book } from "../entities/Book";
import { SystemConfig } from "../entities/SystemConfig";
import { UserNotification } from "../entities/UserNotification";
import { MoreThanOrEqual } from "typeorm";

export class BorrowRequestController {
    static async getAllRequests(req: AuthRequest, res: Response) {
        const status = req.query.status as string as BorrowStatus;
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);

        let where: any = {};
        if (status) {
            where = { status };
        }

        const requests = await borrowRepository.find({
            where,
            relations: ["user", "book"]
        });
        return res.json(requests);
    }

    static async getMyRequests(req: AuthRequest, res: Response) {
        const username = req.user?.username;
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ username });
        if (!user) throw new Error("User not found");

        const requests = await borrowRepository.find({
            where: { user: { id: user.id } },
            relations: ["book"]
        });
        return res.json(requests);
    }

    static async requestBook(req: AuthRequest, res: Response) {
        const bookId = parseInt(req.params.bookId as string);
        const username = req.user?.username;
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const userRepository = AppDataSource.getRepository(User);
        const bookRepository = AppDataSource.getRepository(Book);
        const systemConfigRepository = AppDataSource.getRepository(SystemConfig);

        const user = await userRepository.findOneBy({ username });
        if (!user) throw new Error("User not found");

        if (user.role === UserRole.ROLE_GUEST) {
            return res.status(403).json({ message: "Guests cannot request books" });
        }
        if (user.role === UserRole.ROLE_ADMIN) {
            return res.status(403).json({ message: "Admins cannot borrow books. Only members and librarians can borrow." });
        }

        const book = await bookRepository.findOneBy({ id: bookId });
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.availableCopies <= 0) {
            return res.status(400).json({ message: "No copies available" });
        }

        const activeRequests = await borrowRepository.find({
            where: { user: { id: user.id } },
        });

        const activeCount = activeRequests.filter(r =>
            [BorrowStatus.APPROVED, BorrowStatus.PENDING_LIBRARIAN, BorrowStatus.PENDING_ADMIN, BorrowStatus.OVERDUE].includes(r.status)
        ).length;

        const limit = user.borrowingLimit || 3;
        if (activeCount >= limit) {
            return res.status(400).json({ message: `You have reached your borrowing limit of ${limit} books.` });
        }

        let initialStatus = BorrowStatus.PENDING_LIBRARIAN;
        if (user.role === UserRole.ROLE_LIBRARIAN) {
            initialStatus = BorrowStatus.PENDING_ADMIN;
        }

        const config = await systemConfigRepository.findOne({ where: {} });
        if (config?.autoApproveMembers && user.role === UserRole.ROLE_MEMBER) {
            initialStatus = BorrowStatus.APPROVED;
        }

        const request = borrowRepository.create({
            user,
            book,
            requestDate: new Date(),
            status: initialStatus,
            isRenewal: false
        });

        if (initialStatus === BorrowStatus.APPROVED) {
            request.approvalDate = new Date();
            request.dueDate = new Date();
            request.dueDate.setDate(request.dueDate.getDate() + 14);
            book.availableCopies -= 1;
            await bookRepository.save(book);
        }

        await borrowRepository.save(request);
        return res.json({ message: `Request submitted successfully. Status: ${initialStatus}` });
    }

    static async requestRenewal(req: AuthRequest, res: Response) {
        const id = parseInt(req.params.id as string);
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);

        const request = await borrowRepository.findOneBy({ id });
        if (!request || request.status !== BorrowStatus.APPROVED) {
            return res.status(400).json({ message: "Only active borrowings can be renewed" });
        }

        request.status = BorrowStatus.PENDING_LIBRARIAN;
        request.isRenewal = true;
        await borrowRepository.save(request);

        return res.json({ message: "Renewal request submitted successfully" });
    }

    static async librarianReview(req: AuthRequest, res: Response) {
        const id = parseInt(req.params.id as string);
        const approve = req.query.approve === "true";
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const notificationRepository = AppDataSource.getRepository(UserNotification);

        const request = await borrowRepository.findOne({
            where: { id },
            relations: ["user", "book"]
        });
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = approve ? BorrowStatus.PENDING_ADMIN : BorrowStatus.REJECTED;
        await borrowRepository.save(request);

        const msg = approve
            ? `Your request for "${request.book.title}" was approved by the librarian and is pending admin approval.`
            : `Your request for "${request.book.title}" was rejected by the librarian.`;

        await notificationRepository.save(notificationRepository.create({
            user: request.user,
            message: msg,
            read: false
        }));

        return res.json({ message: "Reviewed by librarian" });
    }

    static async adminApprove(req: AuthRequest, res: Response) {
        const id = parseInt(req.params.id as string);
        const approve = req.query.approve === "true";
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const bookRepository = AppDataSource.getRepository(Book);
        const notificationRepository = AppDataSource.getRepository(UserNotification);

        const request = await borrowRepository.findOne({
            where: { id },
            relations: ["user", "book"]
        });
        if (!request) return res.status(404).json({ message: "Request not found" });

        if (approve) {
            request.status = BorrowStatus.APPROVED;
            request.approvalDate = new Date();
            request.dueDate = new Date();
            request.dueDate.setDate(request.dueDate.getDate() + 14);

            const book = request.book;
            book.availableCopies -= 1;
            await bookRepository.save(book);
        } else {
            request.status = BorrowStatus.REJECTED;
        }

        await borrowRepository.save(request);

        const msg = approve
            ? `Your request for "${request.book.title}" has been approved! You can collect your book.`
            : `Your request for "${request.book.title}" was rejected.`;

        await notificationRepository.save(notificationRepository.create({
            user: request.user,
            message: msg,
            read: false
        }));

        return res.json({ message: "Final decision by admin" });
    }

    static async getMyHistory(req: AuthRequest, res: Response) {
        const username = req.user?.username;
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const userRepository = AppDataSource.getRepository(User);
        const configRepository = AppDataSource.getRepository(SystemConfig);

        const user = await userRepository.findOneBy({ username });
        if (!user) throw new Error("User not found");

        const history = await borrowRepository.find({
            where: { user: { id: user.id } },
            relations: ["book"]
        });

        const config = await configRepository.findOne({ where: {} });
        const fineRate = config?.fineRate || 1.0;
        const gracePeriod = config?.gracePeriod || 0;

        const now = new Date();
        for (const request of history) {
            if (request.status === BorrowStatus.APPROVED && request.dueDate) {
                const dueDateGrace = new Date(request.dueDate);
                dueDateGrace.setDate(dueDateGrace.getDate() + gracePeriod);

                if (now > dueDateGrace) {
                    const diffTime = Math.abs(now.getTime() - dueDateGrace.getTime());
                    const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    request.fineAmount = lateDays * fineRate;
                    if (lateDays > 0) {
                        request.status = BorrowStatus.OVERDUE;
                        await borrowRepository.save(request);
                    }
                }
            }
        }

        return res.json(history);
    }

    static async getDashboardStats(req: AuthRequest, res: Response) {
        const username = req.user?.username;
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ username });
        if (!user) throw new Error("User not found");

        const myRequests = await borrowRepository.find({
            where: { user: { id: user.id } },
            relations: ["book"]
        });

        let totalFine = 0;
        let dueSoon = 0;
        const now = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(now.getDate() + 3);

        for (const request of myRequests) {
            if (request.fineAmount) totalFine += request.fineAmount;
            if (request.status === BorrowStatus.APPROVED && request.dueDate) {
                if (request.dueDate > now && request.dueDate < threeDaysLater) {
                    dueSoon++;
                }
            }
        }

        return res.json({
            totalFine,
            dueSoon,
            totalBorrowed: myRequests.length
        });
    }

    static async payFine(req: AuthRequest, res: Response) {
        const id = parseInt(req.params.id as string);
        const borrowRepository = AppDataSource.getRepository(BorrowRequest);

        const request = await borrowRepository.findOneBy({ id });
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.finePaid = true;
        request.fineAmount = 0;
        await borrowRepository.save(request);

        return res.json({ message: "Fine paid successfully" });
    }

    static async toggleUserStatus(req: AuthRequest, res: Response) {
        const userId = parseInt(req.params.userId as string);
        const enabled = req.query.enabled === "true";
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.enabled = enabled;
        await userRepository.save(user);

        return res.json({ message: "User status updated" });
    }

    static async getAllUsers(req: AuthRequest, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        return res.json(users);
    }
}
