import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entities/Book";
import { BookTag } from "../entities/BookTag";
import { ILike } from "typeorm";

export class BookController {
    static async getAllBooks(req: Request, res: Response) {
        const search = req.query.search as string;
        const genre = req.query.genre as string;
        const bookRepository = AppDataSource.getRepository(Book);

        let where: any = {};
        if (search) {
            where = [
                { title: ILike(`%${search}%`) },
                { author: ILike(`%${search}%`) }
            ];
        } else if (genre) {
            where = { genre };
        }

        const books = await bookRepository.find({ where, relations: ["tags"] });

        // Map back to match Spring Boot format (tags as list of strings)
        const response = books.map(book => ({
            ...book,
            tags: book.tags?.map(t => t.tag) || []
        }));

        return res.json(response);
    }

    static async getBookById(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        const bookRepository = AppDataSource.getRepository(Book);

        const book = await bookRepository.findOne({
            where: { id },
            relations: ["tags"]
        });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.json({
            ...book,
            tags: book.tags?.map(t => t.tag) || []
        });
    }

    static async createBook(req: Request, res: Response) {
        const bookData = req.body;
        const bookRepository = AppDataSource.getRepository(Book);
        const tagRepository = AppDataSource.getRepository(BookTag);

        const { tags, ...rest } = bookData;
        const book = bookRepository.create(rest as Book);
        const savedBook = await bookRepository.save(book);

        if (tags && Array.isArray(tags)) {
            const tagEntities = tags.map(tag => tagRepository.create({ bookId: savedBook.id, tag }));
            await tagRepository.save(tagEntities);
        }

        return res.json(savedBook);
    }

    static async updateBook(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        const bookData = req.body;
        const bookRepository = AppDataSource.getRepository(Book);
        const tagRepository = AppDataSource.getRepository(BookTag);

        const book = await bookRepository.findOneBy({ id });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const { tags, ...rest } = bookData;
        bookRepository.merge(book, rest);
        const updatedBook = await bookRepository.save(book);

        if (tags && Array.isArray(tags)) {
            await tagRepository.delete({ bookId: id });
            const tagEntities = tags.map(tag => tagRepository.create({ bookId: id, tag }));
            await tagRepository.save(tagEntities);
        }

        return res.json(updatedBook);
    }

    static async deleteBook(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        const bookRepository = AppDataSource.getRepository(Book);
        const tagRepository = AppDataSource.getRepository(BookTag);

        const book = await bookRepository.findOneBy({ id });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await tagRepository.delete({ bookId: id });
        await bookRepository.remove(book);

        return res.status(200).send();
    }

    static async getAllGenres(req: Request, res: Response) {
        const bookRepository = AppDataSource.getRepository(Book);
        const books = await bookRepository.find({ select: ["genre"] });

        const genres = Array.from(new Set(books.map(b => b.genre).filter(g => !!g))).sort();
        return res.json(genres);
    }
}
