import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.html'
})
export class LoginComponent {
    username = '';
    password = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                alert('Login failed: ' + (err.error?.message || 'Invalid credentials'));
            }
        });
    }

    onGoogleLogin() {
        // For demo purposes: simulate Google OAuth flow
        // In production, you would use Google Sign-In library to get the idToken
        const demoIdToken = 'demo-google-token-' + Date.now();

        this.authService.googleLogin(demoIdToken).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                alert('Google login failed: ' + (err.error?.message || 'Authentication error'));
            }
        });
    }
}
