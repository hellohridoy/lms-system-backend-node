import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowService } from '../../core/services/borrow.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-request-management',
    imports: [CommonModule],
    templateUrl: './requests.html'
})
export class RequestManagementComponent implements OnInit {
    requests: any[] = [];
    userRole: string = '';

    constructor(private borrowService: BorrowService, private authService: AuthService) { }

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
        if (this.userRole === 'ROLE_LIBRARIAN') {
            this.borrowService.reviewRequest(id, approve).subscribe(() => this.loadRequests());
        } else if (this.userRole === 'ROLE_ADMIN') {
            this.borrowService.approveRequest(id, approve).subscribe(() => this.loadRequests());
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
