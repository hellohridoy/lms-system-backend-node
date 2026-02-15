import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("user_notifications")
export class UserNotification {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    message: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamp", precision: 6 })
    createdAt: Date;
}
