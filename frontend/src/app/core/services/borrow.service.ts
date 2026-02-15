import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BorrowService {
    private apiUrl = `${environment.apiUrl}/borrows`;

    constructor(private http: HttpClient) { }

    getAllRequests(status?: string): Observable<any[]> {
        const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
        return this.http.get<any[]>(url);
    }

    getMyRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my`);
    }

    requestBook(bookId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/request/${bookId}`, {});
    }

    reviewRequest(id: number, approve: boolean): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/review?approve=${approve}`, {});
    }

    approveRequest(id: number, approve: boolean): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/approve?approve=${approve}`, {});
    }

    getMyHistory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my-history`);
    }

    renewBook(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/renew/${id}`, {});
    }

    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }
}
