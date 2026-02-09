import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-topbar',
    imports: [CommonModule],
    templateUrl: './topbar.html'
})
export class TopbarComponent implements OnInit {
    userName: string = 'User';
    userRoleDisplay: string = 'Member';

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userName = user.username;
                this.userRoleDisplay = user.role.replace('ROLE_', '').toLowerCase();
                this.userRoleDisplay = this.userRoleDisplay.charAt(0).toUpperCase() + this.userRoleDisplay.slice(1);
            }
        });
    }
}
