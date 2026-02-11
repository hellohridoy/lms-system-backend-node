import { Component, EventEmitter, Output, Input } from '@angular/core';
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
    @Input() bookToEdit: Book | null = null;
    @Input() defaultGenre: string | null = null;

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

    genres: string[] = [];
    showCustomGenre = false;
    customGenre = '';

    constructor(
        private bookService: BookService,
        private dataUpdateService: DataUpdateService,
        private modalService: ModalService
    ) { }

    ngOnInit() {
        this.loadGenres();
        if (this.bookToEdit) {
            this.book = { ...this.bookToEdit };
        } else if (this.defaultGenre) {
            this.book.genre = this.defaultGenre;
        }
    }

    loadGenres() {
        this.bookService.getGenres().subscribe({
            next: (data) => {
                // Merge with default list to ensure common ones are present if DB is empty
                const defaults = ['Spring Boot', 'Laravel', 'Python', 'Angular', 'React', 'Vue', 'Next.js', 'Tailwind',
                    'Node.js', 'Go', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
                    'Flutter', 'React Native', 'Swift', 'Kotlin',
                    'Docker', 'Kubernetes', 'AWS', 'Azure'];
                this.genres = [...new Set([...defaults, ...data, 'Other'])].sort();
            },
            error: () => {
                this.genres = ['Spring Boot', 'Laravel', 'Python', 'Angular', 'React', 'Vue', 'Other'];
            }
        });
    }

    onSubmit() {
        if (this.book.genre === 'Other' && this.customGenre) {
            this.book.genre = this.customGenre;
        }

        if (this.bookToEdit && this.book.id) {
            // Update existing book
            this.bookService.updateBook(this.book.id, this.book as Book).subscribe({
                next: () => {
                    this.modalService.show('Book updated successfully!', 'success');
                    this.dataUpdateService.notifyUpdate();
                    this.close.emit();
                },
                error: (err) => alert('Error updating book: ' + err.message)
            });
        } else {
            // Create new book
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
}
