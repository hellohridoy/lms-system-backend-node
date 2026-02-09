import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login';
import { ForgotPasswordComponent } from './features/auth/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password';
import { DashboardComponent } from './features/dashboard/dashboard';
import { CatalogComponent } from './features/catalog/catalog';
import { RequestManagementComponent } from './features/management/requests';
import { HistoryComponent } from './features/profile/history';
import { AdminLayoutComponent } from './shared/components/admin-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'auth/login', component: LoginComponent },
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
            { path: 'history', component: HistoryComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
