import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationsSource = new Subject<Notification>();
    notifications$ = this.notificationsSource.asObservable();

    private notificationListSource = new BehaviorSubject<Notification[]>([]);
    notificationList$ = this.notificationListSource.asObservable();

    private nextId = 0;

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
        const notification: Notification = {
            id: this.nextId++,
            message,
            type,
            timestamp: new Date()
        };

        this.notificationsSource.next(notification);

        // Add to the persistent list (for dropdown)
        const currentList = this.notificationListSource.getValue();
        this.notificationListSource.next([notification, ...currentList].slice(0, 10)); // Keep last 10
    }

    clearAll() {
        this.notificationListSource.next([]);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    info(message: string) {
        this.show(message, 'info');
    }

    warning(message: string) {
        this.show(message, 'warning');
    }
}
