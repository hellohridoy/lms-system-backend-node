import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar';
import { TopbarComponent } from './topbar';
import { NotificationsComponent } from './notifications';

@Component({
    selector: 'app-admin-layout',
    imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, NotificationsComponent],
    templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent { }
