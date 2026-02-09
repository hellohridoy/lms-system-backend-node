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

    get isAdmin() {
        return this.authService.isAdmin();
    }
}
