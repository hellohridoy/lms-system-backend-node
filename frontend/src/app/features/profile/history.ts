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

    constructor(private borrowService: BorrowService) { }

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        this.borrowService.getMyHistory().subscribe({
            next: (data) => this.history = data,
            error: (err) => console.error('Failed to load history', err)
        });
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
}
