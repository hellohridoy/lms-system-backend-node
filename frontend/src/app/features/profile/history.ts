import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowService } from '../../core/services/borrow.service';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './history.html'
})
export class HistoryComponent implements OnInit {
    history: any[] = [];
    activeBorrowings: any[] = [];
    pastHistory: any[] = [];

    constructor(private borrowService: BorrowService) { }

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        this.borrowService.getMyHistory().subscribe({
            next: (data) => {
                this.history = data;
                this.activeBorrowings = data.filter((item: any) => item.status === 'APPROVED' || item.status === 'OVERDUE');
                this.pastHistory = data.filter((item: any) => item.status !== 'APPROVED' && item.status !== 'OVERDUE');
            },
            error: (err) => console.error('Failed to load history', err)
        });
    }

    renewBook(id: number) {
        this.borrowService.renewBook(id).subscribe({
            next: () => {
                alert('Renewal request submitted successfully!');
                this.loadHistory();
            },
            error: (err) => alert('Error requesting renewal: ' + err.error)
        });
    }

    payFine(id: number) {
        alert('Redirecting to payment gateway... (Mock)');
    }

    getStatusClass(status: string): string {
        const baseClass = 'px-3 py-1 rounded-full text-xs font-semibold ';
        switch (status) {
            case 'APPROVED': return baseClass + 'bg-green-500/20 text-green-300';
            case 'PENDING_LIBRARIAN':
            case 'PENDING_ADMIN': return baseClass + 'bg-yellow-500/20 text-yellow-300';
            case 'REJECTED': return baseClass + 'bg-red-500/20 text-red-300';
            case 'RETURNED': return baseClass + 'bg-blue-500/20 text-blue-300';
            case 'OVERDUE': return baseClass + 'bg-orange-500/20 text-orange-300';
            default: return baseClass + 'bg-gray-500/20 text-gray-300';
        }
    }

    formatStatus(status: string): string {
        return status.replace(/_/g, ' ');
    }

    getRemainingDays(dueDate: string | undefined): number | null {
        if (!dueDate) return null;
        const due = new Date(dueDate);
        const now = new Date();
        const diff = due.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}
