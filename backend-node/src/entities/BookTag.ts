import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Book } from "./Book";

@Entity("book_tags")
export class BookTag {
    @PrimaryColumn({ name: "book_id", type: "bigint" })
    bookId: number;

    @PrimaryColumn()
    tag: string;

    @ManyToOne(() => Book)
    @JoinColumn({ name: "book_id" })
    book: Book;
}
