import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { AddBookComponent } from '../management/add-book';
import { DataUpdateService } from '../../core/services/data-update.service';
import { BorrowService } from '../../core/services/borrow.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, AddBookComponent],
    templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
    showAddBookModal = false;
    stats: any = {
        totalBooks: 0,
        activeMembers: 0,
        pendingRequests: 0,
        overdueFines: 0,
        recentActivities: [],
        popularBooks: []
    };
    userStats: any = {
        totalFine: 0,
        dueSoon: 0,
        totalBorrowed: 0
    };

    constructor(
        private http: HttpClient,
        public authService: AuthService,
        private dataUpdateService: DataUpdateService,
        private borrowService: BorrowService
    ) { }

    ngOnInit() {
        this.loadStats();
        this.dataUpdateService.dataUpdated$.subscribe(() => {
            this.loadStats();
        });
    }

    loadStats() {
        if (this.isAdmin) {
            this.http.get('http://localhost:8080/api/dashboard/stats').subscribe({
                next: (data) => this.stats = data,
                error: (err) => console.error('Failed to load dashboard stats', err)
            });
        } else {
            this.borrowService.getDashboardStats().subscribe({
                next: (data) => this.userStats = data,
                error: (err) => console.error('Failed to load user stats', err)
            });
        }
    }

    openAddBookModal() {
        this.showAddBookModal = true;
    }

    exportReport() {
        this.http.get('http://localhost:8080/api/reports/export', { responseType: 'blob' }).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `library_report_${new Date().getTime()}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            },
            error: (err) => console.error('Export failed', err)
        });
    }

    get isAdmin() {
        return this.authService.isAdmin();
    }
}
