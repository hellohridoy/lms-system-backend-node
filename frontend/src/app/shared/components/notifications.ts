import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="fixed top-24 right-6 z-50 space-y-4 w-80 pointer-events-none">
            <div *ngFor="let n of activeNotifications" 
                 [class]="getClasses(n.type)"
                 class="p-4 rounded-2xl shadow-2xl border backdrop-blur-md pointer-events-auto transform transition-all duration-300 animate-slide-in">
                <div class="flex items-start gap-3">
                    <div [class]="getIconBg(n.type)" class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg *ngIf="n.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        <svg *ngIf="n.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        <svg *ngIf="n.type === 'info' || n.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-bold text-gray-900">{{ n.message }}</p>
                        <p class="text-[10px] text-gray-500 mt-0.5">{{ n.timestamp | date:'shortTime' }}</p>
                    </div>
                    <button (click)="remove(n.id)" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
    `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
    activeNotifications: Notification[] = [];
    private sub?: Subscription;

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.sub = this.notificationService.notifications$.subscribe(n => {
            this.activeNotifications.unshift(n);
            setTimeout(() => this.remove(n.id), 5000);
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    remove(id: number) {
        this.activeNotifications = this.activeNotifications.filter(n => n.id !== id);
    }

    getClasses(type: string): string {
        switch (type) {
            case 'success': return 'bg-green-50/90 border-green-100';
            case 'error': return 'bg-red-50/90 border-red-100';
            case 'warning': return 'bg-yellow-50/90 border-yellow-100';
            default: return 'bg-blue-50/90 border-blue-100';
        }
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
