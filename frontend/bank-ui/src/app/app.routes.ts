import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ClerkDashboardComponent } from './pages/clerk-dashboard/clerk-dashboard.component';
import { CreateClerkComponent } from './pages/create-clerk/create-clerk.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AccountTransactionsComponent } from './pages/account-transactions/account-transactions.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'manager',
    canActivate: [roleGuard],
    canActivateChild: [roleGuard],
    data: { roles: ['ROLE_MANAGER'] },
    children: [
      { path: '', component: ManagerDashboardComponent },
      { path: 'create-clerk', component: CreateClerkComponent },
      { path: 'create-account', component: CreateAccountComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'transactions', component: AccountTransactionsComponent }
    ]
  }
  ,

  {
    path: 'clerk',
    canActivate: [roleGuard],
    data: { roles: ['ROLE_CLERK'] },
    children: [
      { path: '', component: ClerkDashboardComponent },
      { path: 'transactions', component: AccountTransactionsComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
