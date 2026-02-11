import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './topbar.html'
})
export class TopbarComponent implements OnInit {
    userName: string = 'User';
    userRoleDisplay: string = 'Member';
    membershipText: string = '';
    showNotifications = false;
    notifications: Notification[] = [];

    constructor(
        private authService: AuthService,
        private notificationService: NotificationService
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

        this.notificationService.notificationList$.subscribe(list => {
            this.notifications = list;
        });
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
    }

    markAsRead(id: number) {
        this.notificationService.markAsRead(id);
    }

    markAllAsRead() {
        this.notificationService.markAllAsRead();
        this.showNotifications = false;
    }

    clearAll() {
        this.notificationService.clearAll();
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
