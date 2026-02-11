import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users.html'
})
export class UsersComponent implements OnInit {
    users: any[] = [];
    apiUrl = 'http://localhost:8080/api/borrows/users';

    constructor(private http: HttpClient, private authService: AuthService) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (data) => this.users = data,
            error: (err) => console.error('Failed to load users', err)
        });
    }

    toggleStatus(userId: number, currentStatus: boolean) {
        this.http.put(`${this.apiUrl}/${userId}/status?enabled=${!currentStatus}`, {}).subscribe({
            next: () => {
                alert('User status updated successfully');
                this.loadUsers();
            },
            error: (err) => alert('Error updating status: ' + err.error)
        });
    }

    getRoleBadgeClass(role: string): string {
        const baseClass = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ';
        switch (role) {
            case 'ROLE_ADMIN': return baseClass + 'bg-red-100 text-red-700';
            case 'ROLE_LIBRARIAN': return baseClass + 'bg-purple-100 text-purple-700';
            case 'ROLE_MEMBER': return baseClass + 'bg-blue-100 text-blue-700';
            default: return baseClass + 'bg-gray-100 text-gray-700';
        }
    }
}
