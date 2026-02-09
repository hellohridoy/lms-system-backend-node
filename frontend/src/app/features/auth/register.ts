import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.html'
})
export class RegisterComponent {
    user = {
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        role: 'ROLE_MEMBER'
    };
    isLoading = false;
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.register(this.user).subscribe({
            next: () => {
                this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
                this.isLoading = false;
            }
        });
    }
}
