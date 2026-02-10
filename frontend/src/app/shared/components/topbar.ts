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
            }
        });

        this.notificationService.notificationList$.subscribe(list => {
            this.notifications = list;
        });
    }

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
    }

    clearAll() {
        this.notificationService.clearAll();
    }
}
