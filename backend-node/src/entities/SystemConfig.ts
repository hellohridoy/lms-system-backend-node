import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("system_config")
export class SystemConfig {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ name: "fine_rate", type: "double precision", nullable: true })
    fineRate: number;

    @Column({ name: "grace_period", nullable: true })
    gracePeriod: number;

    @Column({ name: "auto_approve_members", default: false })
    autoApproveMembers: boolean;

    @Column({ name: "librarian_request_approval_required", default: true })
    librarianRequestApprovalRequired: boolean;

    @Column({ name: "default_member_borrowing_limit", default: 3 })
    defaultMemberBorrowingLimit: number;

    @Column({ name: "default_librarian_borrowing_limit", default: 10 })
    defaultLibrarianBorrowingLimit: number;
}
