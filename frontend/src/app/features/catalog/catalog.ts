import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../core/services/book.service';
import { BorrowService } from '../../core/services/borrow.service';
import { AuthService } from '../../core/services/auth.service';
import { DataUpdateService } from '../../core/services/data-update.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './catalog.html'
})
export class CatalogComponent implements OnInit {
    books: Book[] = [];
    allBooks: Book[] = [];
    selectedGenre: string | null = null;
    searchTerm: string = '';
    selectedYear: number | null = null;
    userRole: string = '';

    constructor(
        private bookService: BookService,
        private borrowService: BorrowService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private dataUpdateService: DataUpdateService,
        private modalService: ModalService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        const user = this.authService.getUser();
        this.userRole = user?.role || 'ROLE_GUEST';

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
        this.bookService.getBooks(this.searchTerm || undefined, genre, this.selectedYear || undefined).subscribe(books => {
            this.allBooks = books;
            this.books = books;
        });
    }

    onSearch(event: any) {
        this.searchTerm = event.target.value;
        this.loadBooks();
    }

    requestBook(bookId: number) {
        this.borrowService.requestBook(bookId).subscribe({
            next: () => {
                this.modalService.show('Borrow request submitted successfully!', 'success');
                this.notificationService.success('Your borrow request for book #' + bookId + ' has been submitted.');
                this.loadBooks();
            },
            error: (err) => {
                const errorMessage = err.error?.message || err.error || err.message || 'Unknown error';

                if (err.status === 400) {
                    // Business rule error (e.g. limit reached), show message directly
                    this.modalService.show(errorMessage, 'error');
                    this.notificationService.error(errorMessage);
                } else {
                    // System error or other failure
                    this.modalService.show('Request failed: ' + errorMessage, 'error');
                    this.notificationService.error('Failed to request book: ' + errorMessage);
                }
            }
        });
    }
}
