import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Reports & Analytics</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Inventory Heatmap -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-bold mb-4">Inventory Heatmap (by Genre)</h2>
          <div class="space-y-4">
            <div *ngFor="let item of heatmap | keyvalue" class="relative">
              <div class="flex justify-between text-sm mb-1">
                <span>{{item.key}}</span>
                <span class="font-bold">{{item.value}} Borrows</span>
              </div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div class="bg-indigo-500 h-full" [style.width.%]="(item.value / maxBorrows) * 100"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overdue Ledger Stats -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-bold mb-4">Overdue Ledger</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-xs text-gray-500 uppercase border-b">
                  <th class="pb-2">User</th>
                  <th class="pb-2">Book</th>
                  <th class="pb-2 text-right">Fine</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let req of overdue" class="text-sm">
                  <td class="py-3">{{req.user.fullName || req.user.username}}</td>
                  <td class="py-3">{{req.book.title}}</td>
                  <td class="py-3 text-right text-red-500 font-bold">\${{req.fineAmount | number:'1.2-2'}}</td>
                </tr>
                <tr *ngIf="overdue.length === 0">
                   <td colspan="3" class="py-4 text-center text-gray-400">No overdue books</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Audit Trail -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold mb-4">Audit Trail (Recent Decisions)</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-xs text-gray-500 uppercase border-b">
                <th class="pb-2">Date</th>
                <th class="pb-2">User</th>
                <th class="pb-2">Action</th>
                <th class="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let log of audit" class="text-sm">
                <td class="py-3">{{log.requestDate | date:'short'}}</td>
                <td class="py-3">{{log.user.username}}</td>
                <td class="py-3">{{log.book.title}}</td>
                <td class="py-3 text-right">
                  <span [class]="'px-2 py-1 rounded-full text-xs ' + getStatusClass(log.status)">
                    {{log.status}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
    heatmap: any = {};
    overdue: any[] = [];
    audit: any[] = [];
    maxBorrows: number = 1;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get('/api/reports/inventory-heatmap').subscribe(res => {
            this.heatmap = res;
            this.maxBorrows = Math.max(...Object.values(this.heatmap) as number[], 1);
        });
        this.http.get('/api/reports/overdue').subscribe((res: any) => this.overdue = res);
        this.http.get('/api/reports/audit-trail').subscribe((res: any) => this.audit = res);
    }

    getStatusClass(status: string) {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            case 'RETURNED': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }
}
