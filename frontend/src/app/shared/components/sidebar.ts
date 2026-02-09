import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.html'
})
export class SidebarComponent implements OnInit {
    userRole: string = '';
    genres: string[] = [];
    isBackendExpanded: boolean = false;
    isFrontendExpanded: boolean = false;
    isManagementMode: boolean = true; // For Librarian dual view

    backendMenus = [
        { name: 'Spring Boot', icon: '🍃' },
        { name: 'Laravel', icon: '🎒' },
        { name: 'Python', icon: '🐍' }
    ];

    frontendMenus = [
        { name: 'Angular', icon: '🅰️' },
        { name: 'React', icon: '⚛️' },
        { name: 'Vue', icon: '🖖' }
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
        this.loadGenres();
    }

    loadGenres() {
        this.bookService.getGenres().subscribe({
            next: (data) => this.genres = data,
            error: (err) => console.error('Failed to load genres', err)
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
}
