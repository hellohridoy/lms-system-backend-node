import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar';
import { TopbarComponent } from './topbar';

@Component({
    selector: 'app-admin-layout',
    imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
    templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent { }
