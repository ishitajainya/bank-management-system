import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction, PageResponse } from '../../services/transactions.service';

@Component({
  selector: 'app-account-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.css'],
})
export class AccountTransactionsComponent {
  accountNumber = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  transactions: Transaction[] = [];
  loading = false;
  errorMsg = '';

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(private txService: TransactionsService) {}

  onSearch(): void {
    this.page = 0;
    this.fetch();
  }

  fetch(): void {
    this.errorMsg = '';

    if (this.accountNumber.invalid) {
      this.errorMsg = 'Please enter an account number.';
      return;
    }

    this.loading = true;

    this.txService
      .getAccountTransactions(this.accountNumber.value.trim(), this.page, this.size)
      .subscribe({
        next: (res: PageResponse<Transaction>) => {
          this.transactions = res.content ?? [];
          this.totalPages = res.totalPages ?? 0;
          this.totalElements = res.totalElements ?? 0;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.transactions = [];
          this.errorMsg =
            err?.error?.message || 'Failed to load transactions.';
        },
      });
  }

  nextPage(): void {
    if (this.page + 1 >= this.totalPages) return;
    this.page++;
    this.fetch();
  }

  prevPage(): void {
    if (this.page <= 0) return;
    this.page--;
    this.fetch();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  trackById(_: number, t: Transaction) {
    return t.id;
  }
}
