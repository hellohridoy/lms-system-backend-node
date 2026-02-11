import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface Notification {
    id: number;
    message: string;
    title?: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: Date;
    read: boolean;
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

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) {
        const notification: Notification = {
            id: this.nextId++,
            message,
            title,
            type,
            timestamp: new Date(),
            read: false
        };

        this.notificationsSource.next(notification);

        // Add to the persistent list (for dropdown)
        const currentList = this.notificationListSource.getValue();
        this.notificationListSource.next([notification, ...currentList].slice(0, 20)); // Keep last 20
    }

    markAsRead(id: number) {
        const currentList = this.notificationListSource.getValue();
        const updatedList = currentList.map(n => n.id === id ? { ...n, read: true } : n);
        this.notificationListSource.next(updatedList);
    }

    markAllAsRead() {
        const currentList = this.notificationListSource.getValue();
        const updatedList = currentList.map(n => ({ ...n, read: true }));
        this.notificationListSource.next(updatedList);
    }

    clearAll() {
        this.notificationListSource.next([]);
    }

    success(message: string, title?: string) {
        this.show(message, 'success', title);
    }

    error(message: string, title?: string) {
        this.show(message, 'error', title);
    }

    info(message: string, title?: string) {
        this.show(message, 'info', title);
    }

    warning(message: string, title?: string) {
        this.show(message, 'warning', title);
    }
}
