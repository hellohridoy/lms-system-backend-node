import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

export enum BorrowStatus {
    PENDING_LIBRARIAN = "PENDING_LIBRARIAN",
    PENDING_ADMIN = "PENDING_ADMIN",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE",
}

@Entity("borrow_requests")
export class BorrowRequest {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Book)
    @JoinColumn({ name: "book_id" })
    book: Book;

    @Column({ name: "request_date", type: "timestamp", precision: 6, nullable: true })
    requestDate: Date;

    @Column({ name: "approval_date", type: "timestamp", precision: 6, nullable: true })
    approvalDate: Date;

    @Column({ name: "due_date", type: "timestamp", precision: 6, nullable: true })
    dueDate: Date;

    @Column({ name: "return_date", type: "timestamp", precision: 6, nullable: true })
    returnDate: Date;

    @Column({ name: "fine_amount", type: "double precision", nullable: true })
    fineAmount: number;

    @Column({ name: "is_renewal", default: false })
    isRenewal: boolean;

    @Column({ name: "fine_paid", default: false })
    finePaid: boolean;

    @Column({
        type: "enum",
        enum: BorrowStatus,
        default: BorrowStatus.PENDING_LIBRARIAN
    })
    status: BorrowStatus;
}
