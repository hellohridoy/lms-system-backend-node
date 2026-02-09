import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login';
import { ForgotPasswordComponent } from './features/auth/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password';
import { RegisterComponent } from './features/auth/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { CatalogComponent } from './features/catalog/catalog';
import { RequestManagementComponent } from './features/management/requests';
import { UsersComponent } from './features/management/users';
import { HistoryComponent } from './features/profile/history';
import { SettingsComponent } from './features/management/settings';
import { ReportsComponent } from './features/management/reports';
import { AdminLayoutComponent } from './shared/components/admin-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/forgot-password', component: ForgotPasswordComponent },
    { path: 'auth/reset-password', component: ResetPasswordComponent },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'catalog', component: CatalogComponent },
            { path: 'management/requests', component: RequestManagementComponent },
            { path: 'management/users', component: UsersComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] } },
            { path: 'management/settings', component: SettingsComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] } },
            { path: 'management/reports', component: ReportsComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] } },
            { path: 'history', component: HistoryComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
