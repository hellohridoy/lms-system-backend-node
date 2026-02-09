import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
    private nextId = 0;

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
        this.notificationsSource.next({
            id: this.nextId++,
            message,
            type,
            timestamp: new Date()
        });
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
