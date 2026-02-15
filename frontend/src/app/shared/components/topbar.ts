import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationApiService, ServerNotification } from '../../core/services/notification-api.service';

export interface NotificationDisplay {
    id: number;
    message: string;
    title?: string;
    read: boolean;
    timestamp: Date;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './topbar.html'
})
export class TopbarComponent implements OnInit, OnDestroy {
    userName: string = 'User';
    userRoleDisplay: string = 'Member';
    membershipText: string = '';
    showNotifications = false;
    notifications: NotificationDisplay[] = [];
    private pollInterval?: ReturnType<typeof setInterval>;
    private toastShownIds = new Set<number>();

    constructor(
        private authService: AuthService,
        private notificationService: NotificationService,
        private notificationApiService: NotificationApiService
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userName = user.username;
                this.userRoleDisplay = user.role.replace('ROLE_', '').toLowerCase();
                this.userRoleDisplay = this.userRoleDisplay.charAt(0).toUpperCase() + this.userRoleDisplay.slice(1);

                if (user.registrationDate) {
                    const regDate = new Date(user.registrationDate);
                    this.membershipText = `Member since ${regDate.toLocaleDateString()}`;
                }
            }
        });

        this.loadServerNotifications();
        this.pollInterval = setInterval(() => this.loadServerNotifications(), 30000);
    }

    ngOnDestroy() {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }

    loadServerNotifications() {
        this.notificationApiService.getNotifications().subscribe({
            next: (list: ServerNotification[]) => {
                this.notifications = list.map(n => ({
                    id: n.id,
                    message: n.message,
                    title: 'Borrow request',
                    read: n.read,
                    timestamp: new Date(n.createdAt),
                    type: 'info' as const
                }));
                list.filter(n => !n.read).forEach(n => {
                    if (!this.toastShownIds.has(n.id)) {
                        this.toastShownIds.add(n.id);
                        this.notificationService.info(n.message, 'Borrow request update');
                    }
                });
            },
            error: () => { /* ignore */ }
        });
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) this.loadServerNotifications();
    }

    markAsRead(id: number) {
        this.notificationApiService.markAsRead(id).subscribe({
            next: () => {
                this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
            }
        });
    }

    markAllAsRead() {
        this.notificationApiService.markAllAsRead().subscribe({
            next: () => {
                this.notifications = this.notifications.map(n => ({ ...n, read: true }));
                this.showNotifications = false;
            }
        });
    }

    clearAll() {
        this.notificationApiService.markAllAsRead().subscribe({
            next: () => {
                this.notifications = this.notifications.map(n => ({ ...n, read: true }));
                this.showNotifications = false;
            }
        });
    }

    getIconBg(type: string): string {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-600';
            case 'error': return 'bg-red-100 text-red-600';
            case 'warning': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    }
}
