import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ClerkDashboardComponent } from './pages/clerk-dashboard/clerk-dashboard.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'manager',
    component: ManagerDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_MANAGER'] }
  },
  {
    path: 'clerk',
    component: ClerkDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_CLERK'] }
  },

  { path: '**', redirectTo: 'login' }
];
