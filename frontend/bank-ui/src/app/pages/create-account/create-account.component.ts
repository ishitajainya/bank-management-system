import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent {
  managerUsername = '';
  greeting = '';
  holderName = '';
  openingBalance: number | null = null;

  // response preview
  createdAccountNumber: string | null = null;
  createdBalance: number | null = null;

  isLoading = false;
  error = '';
  success = '';

  constructor(
    private accounts: AccountsService,
    private auth: AuthService,
    private router: Router
  ) {
    this.managerUsername = this.auth.getUsername() || '';
  }
  ngOnInit(): void {
    const role = this.auth.getRole();
    if (!this.auth.isLoggedIn() || role !== 'ROLE_MANAGER') {
      this.router.navigate(['/login']);
      return;
    }

    this.managerUsername = this.auth.getUsername() || '';
    this.setGreeting();
  }
  backToManager() {
    this.router.navigate(['/manager']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  private setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }
  createAccount() {
    this.error = '';
    this.success = '';
    this.createdAccountNumber = null;
    this.createdBalance = null;

    const name = this.holderName.trim();

    if (!name) {
      this.error = 'Account holder name is required.';
      return;
    }

    if (this.openingBalance === null || this.openingBalance === undefined || Number.isNaN(this.openingBalance)) {
      this.error = 'Opening balance is required.';
      return;
    }

    if (Number(this.openingBalance) < 0) {
      this.error = 'Opening balance must be 0 or greater.';
      return;
    }

    this.isLoading = true;

    this.accounts
      .createAccount({
        holderName: name,
        openingBalance: Number(this.openingBalance),
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          // backend response: accountNumber, holderName, balance
          this.createdAccountNumber = res?.accountNumber || null;
          this.createdBalance = res?.balance ?? null;

          this.success = 'Account created successfully.';

          // reset form
          this.holderName = '';
          this.openingBalance = null;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to create account.';
        },
      });
  }

  copyAccountNumber() {
    if (!this.createdAccountNumber) return;
    navigator.clipboard?.writeText(this.createdAccountNumber);
  }
}
