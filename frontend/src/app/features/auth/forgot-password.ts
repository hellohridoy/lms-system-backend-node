import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './forgot-password.html'
})
export class ForgotPasswordComponent {
    email: string = '';
    loading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private authService: AuthService) { }

    onSubmit() {
        this.loading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.authService.forgotPassword(this.email).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.successMessage = response.message;
                this.email = '';
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Failed to send reset link. Please try again.';
            }
        });
    }
}
