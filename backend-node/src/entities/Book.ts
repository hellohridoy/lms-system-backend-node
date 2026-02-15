import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BookTag } from "./BookTag";

@Entity("books")
export class Book {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    isbn: string;

    @Column()
    genre: string;

    @Column({ length: 2000, nullable: true })
    synopsis: string;

    @Column({ name: "cover_url", nullable: true })
    coverUrl: string;

    @Column({ name: "total_copies", nullable: true })
    totalCopies: number;

    @Column({ name: "available_copies", nullable: true })
    availableCopies: number;

    @Column({ name: "publication_year", nullable: true })
    publicationYear: number;

    @OneToMany(() => BookTag, (tag) => tag.book, { cascade: true, eager: true })
    tags: BookTag[];
}
