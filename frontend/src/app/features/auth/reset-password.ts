import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './reset-password.html'
})
export class ResetPasswordComponent implements OnInit {
    token: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    loading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || '';
            if (!this.token) {
                this.errorMessage = 'Invalid reset link. Please request a new password reset.';
            }
        });
    }

    onSubmit() {
        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        this.loading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.authService.resetPassword(this.token, this.newPassword).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.successMessage = response.message;
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 3000);
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
            }
        });
    }
}
