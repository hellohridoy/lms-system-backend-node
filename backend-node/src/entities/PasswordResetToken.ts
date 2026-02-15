import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("password_reset_tokens")
export class PasswordResetToken {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ unique: true })
    token: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "expiry_date", type: "timestamp", precision: 6 })
    expiryDate: Date;

    @Column({ default: false })
    used: boolean;
}
