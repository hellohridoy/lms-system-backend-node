import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export enum UserRole {
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_LIBRARIAN = "ROLE_LIBRARIAN",
    ROLE_MEMBER = "ROLE_MEMBER",
    ROLE_GUEST = "ROLE_GUEST",
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PENDING_APPROVAL = "PENDING_APPROVAL",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: "full_name", nullable: true })
    fullName: string;

    @Column({ name: "phone_number", nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    address: string;

    @Column({ name: "borrowing_limit", nullable: true })
    borrowingLimit: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp", precision: 6 })
    createdAt: Date;

    @Column({ name: "registration_date", type: "date", nullable: true })
    registrationDate: Date;

    @Column({ name: "account_non_locked", default: true })
    accountNonLocked: boolean;

    @Column({ default: true })
    enabled: boolean;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.ROLE_MEMBER
    })
    role: UserRole;

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: UserStatus;
}
