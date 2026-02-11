import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';

export interface MenuItem {
    name: string;
    icon?: string;
    route?: string;
    children?: MenuItem[];
    expanded?: boolean;
    roles?: string[];
    queryParams?: any;
    svgPath?: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.html'
})
export class SidebarComponent implements OnInit {
    userRole: string = '';
    isManagementMode: boolean = true;

    menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            route: '/dashboard',
            svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        },
        {
            name: 'Frontend',
            svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            children: [
                { name: 'Angular', svgPath: 'M12 2L2 6l1.3 11 8.7 5 8.7-5L22 6l-10-4zm0 2.2l5.7 2.3-1.6 8.5-4.1 2.3-4.1-2.3-1.6-8.5L12 4.2z', route: '/catalog', queryParams: { genre: 'Angular' } },
                { name: 'React', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8 8 8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z', route: '/catalog', queryParams: { genre: 'React' } },
                { name: 'Vue', svgPath: 'M2 3h4l6 10.4L18 3h4L12 21 2 3z', route: '/catalog', queryParams: { genre: 'Vue' } },
                { name: 'Next.js', svgPath: 'M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM7 8v8h2v-8H7zm8 0v8h2V8h-2z', route: '/catalog', queryParams: { genre: 'Next.js' } },
                { name: 'Tailwind', svgPath: 'M12.5 6.5C10 3 6 3 4 5c-2 2-2 5 0 7l8 9 8-9c2-2 2-5 0-7-2-2-6-2-7.5 1.5z', route: '/catalog', queryParams: { genre: 'Tailwind' } }
            ]
        },
        {
            name: 'Backend',
            svgPath: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
            children: [
                { name: 'Spring Boot', svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1z', route: '/catalog', queryParams: { genre: 'Spring Boot' } },
                { name: 'Node.js', svgPath: 'M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L18.5 7 12 9.8 5.5 7 12 4.2zm-1 14.6V12l-6.5-3v6.8l6.5 3zm1.5-3.3V9.5l6-2.7v6.6l-6 3.1z', route: '/catalog', queryParams: { genre: 'Node.js' } },
                { name: 'Python', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 4h5v4h-5V6zm-6 8h5v4H7v-4z', route: '/catalog', queryParams: { genre: 'Python' } },
                { name: 'Laravel', svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1z', route: '/catalog', queryParams: { genre: 'Laravel' } },
                { name: 'Go', svgPath: 'M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12z', route: '/catalog', queryParams: { genre: 'Go' } }
            ]
        },
        {
            name: 'Databases',
            svgPath: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
            children: [
                { name: 'PostgreSQL', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm-2-4h6v2h-6v-2zm0-4h6v2h-6V8z', route: '/catalog', queryParams: { genre: 'PostgreSQL' } },
                { name: 'MongoDB', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z', route: '/catalog', queryParams: { genre: 'MongoDB' } },
                { name: 'MySQL', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 11h-7v-2h7v2zm0-4h-7V7h7v2z', route: '/catalog', queryParams: { genre: 'MySQL' } },
                { name: 'Redis', svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1z', route: '/catalog', queryParams: { genre: 'Redis' } }
            ]
        },
        {
            name: 'Mobile',
            svgPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
            children: [
                { name: 'Flutter', svgPath: 'M12 2L2 12l10 10 10-10L12 2zm0 14l-4-4 4-4 4 4-4 4z', route: '/catalog', queryParams: { genre: 'Flutter' } },
                { name: 'React Native', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8 8 8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z', route: '/catalog', queryParams: { genre: 'React Native' } },
                { name: 'Swift', svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1z', route: '/catalog', queryParams: { genre: 'Swift' } },
                { name: 'Kotlin', svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1z', route: '/catalog', queryParams: { genre: 'Kotlin' } }
            ]
        },
        {
            name: 'DevOps & Cloud',
            svgPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
            children: [
                { name: 'Docker', svgPath: 'M4 11h16v2H4v-2zm2-4h12v2H6V7zm4-4h4v2h-4V3z', route: '/catalog', queryParams: { genre: 'Docker' } },
                { name: 'Kubernetes', svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1z', route: '/catalog', queryParams: { genre: 'Kubernetes' } },
                { name: 'AWS', svgPath: 'M4 4h16v16H4V4zm2 2v12h12V6H6z', route: '/catalog', queryParams: { genre: 'AWS' } },
                { name: 'Azure', svgPath: 'M4 4h16v16H4V4zm2 2v12h12V6H6z', route: '/catalog', queryParams: { genre: 'Azure' } }
            ]
        },
        {
            name: 'Books',
            route: '/catalog',
            svgPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        },
        {
            name: 'Members',
            route: '/management/users',
            roles: ['ROLE_ADMIN'],
            svgPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
        },
        {
            name: 'Borrow Request',
            route: '/management/requests',
            roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'],
            svgPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            name: 'Settings',
            route: '/management/settings',
            roles: ['ROLE_ADMIN'],
            svgPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
        }
    ];

    constructor(
        public authService: AuthService,
        private bookService: BookService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userRole = user.role;
            }
        });
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }

    toggleManagementMode() {
        this.isManagementMode = !this.isManagementMode;
        if (this.isManagementMode) {
            this.router.navigate(['/management/requests']);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }

    hasRole(roles?: string[]): boolean {
        if (!roles || roles.length === 0) return true;
        return roles.includes(this.userRole);
    }

    toggleSubmenu(item: MenuItem) {
        if (item.children) {
            item.expanded = !item.expanded;
        }
    }

    isActive(route?: string): boolean {
        return route ? this.router.isActive(route, false) : false;
    }
}
