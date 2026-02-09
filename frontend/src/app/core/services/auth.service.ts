import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private userSubject = new BehaviorSubject<any>(null);
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.userSubject.next(JSON.parse(savedUser));
        }
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
            tap((user: any) => {
                localStorage.setItem('token', user.token);
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            })
        );
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, user);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    getUser() {
        return this.userSubject.value;
    }

    getUserRole() {
        const user = this.getUser();
        return user?.role || null;
    }

    isAdmin() {
        return this.getUserRole() === 'ROLE_ADMIN';
    }

    isLibrarian() {
        return this.getUserRole() === 'ROLE_LIBRARIAN';
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
    }

    googleLogin(idToken: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/google`, { idToken }).pipe(
            tap((user: any) => {
                localStorage.setItem('token', user.token);
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            })
        );
    }
}
