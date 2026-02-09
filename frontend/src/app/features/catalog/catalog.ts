import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../core/services/book.service';
import { BorrowService } from '../../core/services/borrow.service';
import { DataUpdateService } from '../../core/services/data-update.service';

@Component({
    selector: 'app-catalog',
    imports: [CommonModule],
    templateUrl: './catalog.html'
})
export class CatalogComponent implements OnInit {
    books: Book[] = [];
    allBooks: Book[] = [];
    selectedGenre: string | null = null;

    constructor(
        private bookService: BookService,
        private borrowService: BorrowService,
        private route: ActivatedRoute,
        private dataUpdateService: DataUpdateService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.selectedGenre = params['genre'] || null;
            this.loadBooks();
        });

        this.dataUpdateService.dataUpdated$.subscribe(() => {
            this.loadBooks();
        });
    }

    loadBooks() {
        const genre = this.selectedGenre || undefined;
        this.bookService.getBooks(undefined, genre).subscribe(books => {
            this.allBooks = books;
            this.books = books;
        });
    }

    requestBook(bookId: number) {
        this.borrowService.requestBook(bookId).subscribe({
            next: () => {
                alert('Request submitted successfully!');
                this.loadBooks();
            },
            error: (err) => alert('Error requesting book: ' + err.error)
        });
    }
}
