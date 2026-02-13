import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { filter } from 'rxjs/operators';

import { TransactionsService } from '../../services/transactions.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clerk-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ add RouterModule
  templateUrl: './clerk-dashboard.component.html',
  styleUrls: ['./clerk-dashboard.component.css'],
})
export class ClerkDashboardComponent implements OnInit, OnDestroy {
  greeting = '';
  username = '';

  accountNumber = '';
  amount: number | null = null;

  success = '';
  error = '';
  lastResponse: any = null;

  isLoading = false;
  activeAction: 'deposit' | 'withdraw' | null = null;

  // ✅ used by *ngIf in your HTML
  isClerkHomeRoute = true;

  private greetingTimerId: any = null;

  constructor(
    private txService: TransactionsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ show username in UI (stored at login time)
    this.username = localStorage.getItem('username') || '';

    // ✅ set greeting immediately
    this.setGreeting();

    // ✅ optional: refresh greeting every minute (if time changes)
    this.greetingTimerId = setInterval(() => this.setGreeting(), 60_000);

    // ✅ detect current route so form shows only on /clerk
    this.isClerkHomeRoute = this.router.url === '/clerk';
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isClerkHomeRoute = this.router.url === '/clerk';
      });
  }

  ngOnDestroy(): void {
    if (this.greetingTimerId) clearInterval(this.greetingTimerId);
  }

  private clearMessages() {
    this.success = '';
    this.error = '';
  }

  private setGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  private validate(): boolean {
    const acc = this.accountNumber.trim();

    if (!acc) {
      this.error = 'Please enter an account number.';
      return false;
    }

    if (this.amount === null || this.amount === undefined || Number.isNaN(this.amount)) {
      this.error = 'Please enter an amount.';
      return false;
    }

    if (Number(this.amount) <= 0) {
      this.error = 'Amount must be greater than 0.';
      return false;
    }

    this.accountNumber = acc;
    return true;
  }

  deposit() {
    this.clearMessages();
    if (!this.validate()) return;

    this.isLoading = true;
    this.activeAction = 'deposit';

    this.txService
      .deposit({ accountNumber: this.accountNumber, amount: Number(this.amount) })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.activeAction = null;
        })
      )
      .subscribe({
        next: (res) => {
          this.lastResponse = res;
          this.success = 'Deposit successful.';
        },
        error: (err) => {
          this.error = err?.error?.message || 'Deposit failed.';
        },
      });
  }

  withdraw() {
    this.clearMessages();
    if (!this.validate()) return;

    this.isLoading = true;
    this.activeAction = 'withdraw';

    this.txService
      .withdraw({ accountNumber: this.accountNumber, amount: Number(this.amount) })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.activeAction = null;
        })
      )
      .subscribe({
        next: (res) => {
          this.lastResponse = res;
          this.success =
            res?.status === 'PENDING_APPROVAL'
              ? 'Withdrawal created: Pending manager approval.'
              : 'Withdrawal successful.';
        },
        error: (err) => {
          this.error = err?.error?.message || 'Withdrawal failed.';
        },
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
