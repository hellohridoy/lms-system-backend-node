import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
    id?: number;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    synopsis: string;
    coverUrl: string;
    totalCopies: number;
    availableCopies: number;
}

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:8080/api/books';

    constructor(private http: HttpClient) { }

    getBooks(search?: string, genre?: string): Observable<Book[]> {
        let params: any = {};
        if (search) params.search = search;
        if (genre) params.genre = genre;
        return this.http.get<Book[]>(this.apiUrl, { params });
    }

    createBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    getGenres(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/genres`);
    }
}
