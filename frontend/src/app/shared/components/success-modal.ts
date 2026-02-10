import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../core/services/modal.service';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="modalService.visible()" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300 animate-pop-in text-center border border-gray-100">
        <div [class]="getIconBg(modalService.type())" 
             class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-current/20">
          <svg *ngIf="modalService.type() === 'success'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <svg *ngIf="modalService.type() === 'error'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <svg *ngIf="modalService.type() === 'info'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <h3 class="text-2xl font-black text-gray-900 mb-2 leading-tight">
          {{ getTitle(modalService.type()) }}
        </h3>
        <p class="text-gray-500 font-medium leading-relaxed">
          {{ modalService.message() }}
        </p>

        <!-- Progress bar for auto-close -->
        <div class="mt-8 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-current transition-all duration-[2000ms] ease-linear"
               [style.width]="'100%'"
               [class]="getProgressBarClass(modalService.type())"></div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes pop-in {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  `]
})
export class SuccessModalComponent {
    constructor(public modalService: ModalService) { }

    getIconBg(type: string): string {
        switch (type) {
            case 'success': return 'bg-green-500 text-white';
            case 'error': return 'bg-red-500 text-white';
            case 'info': return 'bg-blue-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    }

    getProgressBarClass(type: string): string {
        switch (type) {
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500';
            case 'info': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    }

    getTitle(type: string): string {
        switch (type) {
            case 'success': return 'Success!';
            case 'error': return 'Error!';
            case 'info': return 'Notification';
            default: return 'Information';
        }
    }
}
