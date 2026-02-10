import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from '../../core/services/book.service';
import { DataUpdateService } from '../../core/services/data-update.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
    selector: 'app-add-book',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-book.html'
})
export class AddBookComponent {
    @Output() close = new EventEmitter<void>();

    book: Partial<Book> = {
        title: '',
        author: '',
        isbn: '',
        genre: '',
        synopsis: '',
        coverUrl: '',
        totalCopies: 1,
        availableCopies: 1
    };

    genres = ['Spring Boot', 'Laravel', 'Python', 'Angular', 'React', 'Vue', 'Other'];
    showCustomGenre = false;
    customGenre = '';

    constructor(
        private bookService: BookService,
        private dataUpdateService: DataUpdateService,
        private modalService: ModalService
    ) { }

    onSubmit() {
        if (this.book.genre === 'Other' && this.customGenre) {
            this.book.genre = this.customGenre;
        }
        this.bookService.createBook(this.book as Book).subscribe({
            next: () => {
                this.modalService.show('Book added successfully!', 'success');
                this.dataUpdateService.notifyUpdate();
                this.close.emit();
            },
            error: (err) => alert('Error adding book: ' + err.message)
        });
    }
}
