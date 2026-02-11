import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowService } from '../../core/services/borrow.service';
import { AuthService } from '../../core/services/auth.service';
import { ModalService } from '../../core/services/modal.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-request-management',
    imports: [CommonModule],
    templateUrl: './requests.html'
})
export class RequestManagementComponent implements OnInit {
    requests: any[] = [];
    userRole: string = '';
    selectedIds: Set<number> = new Set();

    constructor(
        private borrowService: BorrowService,
        private authService: AuthService,
        private modalService: ModalService
    ) { }

    ngOnInit() {
        const user = this.authService.getUser();
        this.userRole = user?.role || '';
        this.loadRequests();
    }

    loadRequests() {
        this.borrowService.getAllRequests().subscribe(reqs => this.requests = reqs);
    }

    canReview(status: string): boolean {
        if (this.userRole === 'ROLE_LIBRARIAN' && status === 'PENDING_LIBRARIAN') return true;
        if (this.userRole === 'ROLE_ADMIN' && status === 'PENDING_ADMIN') return true;
        return false;
    }

    onReview(id: number, approve: boolean) {
        const action = approve ? this.borrowService.reviewRequest(id, true) : this.borrowService.reviewRequest(id, false);
        const adminAction = approve ? this.borrowService.approveRequest(id, true) : this.borrowService.approveRequest(id, false);

        const obs = (this.userRole === 'ROLE_LIBRARIAN') ? action : adminAction;

        obs.subscribe({
            next: () => {
                let msg = '';
                if (approve) {
                    if (this.userRole === 'ROLE_LIBRARIAN') {
                        msg = 'Approved by librarian, pending for admin';
                    } else {
                        msg = 'Request approved successfully!';
                    }
                } else {
                    msg = 'Request rejected successfully!';
                }

                this.modalService.show(msg, approve ? 'success' : 'info');

                if (this.userRole === 'ROLE_LIBRARIAN') {
                    // Remove from list for Librarian (moves to Admin queue)
                    this.requests = this.requests.filter(r => r.id !== id);
                    this.selectedIds.delete(id);
                } else {
                    // Update status in place for Admin (to show "Approved" in UI)
                    const newStatus = approve ? 'APPROVED' : 'REJECTED';
                    this.requests = this.requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
                    this.selectedIds.delete(id);
                }
            },
            error: (err) => console.error('Review failed', err)
        });
    }

    toggleSelection(id: number) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
    }

    onBulkReview(approve: boolean) {
        if (this.selectedIds.size === 0) return;

        const ids = Array.from(this.selectedIds);
        const requests = ids.map(id => {
            if (this.userRole === 'ROLE_LIBRARIAN') {
                return this.borrowService.reviewRequest(id, approve);
            } else {
                return this.borrowService.approveRequest(id, approve);
            }
        });

        forkJoin(requests).subscribe({
            next: () => {
                const msg = `Successfully ${approve ? 'approved' : 'rejected'} ${ids.length} requests`;
                this.modalService.show(msg, approve ? 'success' : 'info');
                this.selectedIds.clear();
                this.loadRequests();
            },
            error: (err) => alert('One or more requests failed: ' + err.message)
        });
    }

    isAllSelected(): boolean {
        return this.requests.length > 0 && this.requests.every(r => this.selectedIds.has(r.id));
    }

    toggleAll() {
        if (this.isAllSelected()) {
            this.selectedIds.clear();
        } else {
            this.requests.forEach(r => this.selectedIds.add(r.id));
        }
    }

    formatStatus(status: string): string {
        return status.replace('PENDING_', 'Pending ').replace('_', ' ');
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING_LIBRARIAN': return 'bg-yellow-100 text-yellow-700';
            case 'PENDING_ADMIN': return 'bg-orange-100 text-orange-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }
}
