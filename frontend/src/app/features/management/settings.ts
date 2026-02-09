import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">System Settings</h1>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fine Rate ($ per day)</label>
            <input type="number" [(ngModel)]="config.fineRate" class="w-full p-2 border rounded-lg">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grace Period (Days)</label>
            <input type="number" [(ngModel)]="config.gracePeriod" class="w-full p-2 border rounded-lg">
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div class="font-medium">Auto-Approve Members</div>
              <div class="text-xs text-gray-500">Members skip the approval queue</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="config.autoApproveMembers" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div class="font-medium">Staff Approval Required</div>
              <div class="text-xs text-gray-500">Librarian self-requests need Admin approval</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="config.librarianRequestApprovalRequired" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Member Borrow Limit</label>
              <input type="number" [(ngModel)]="config.defaultMemberBorrowingLimit" class="w-full p-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Staff Borrow Limit</label>
              <input type="number" [(ngModel)]="config.defaultLibrarianBorrowingLimit" class="w-full p-2 border rounded-lg">
            </div>
          </div>

          <button (click)="save()" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
    config: any = {};

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get('/api/config').subscribe(res => this.config = res);
    }

    save() {
        this.http.put('/api/config', this.config).subscribe({
            next: () => alert('Configuration saved'),
            error: () => alert('Failed to save configuration')
        });
    }
}
