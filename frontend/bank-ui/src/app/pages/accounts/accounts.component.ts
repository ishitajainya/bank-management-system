import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccountService, CreateAccountResponse, PageResponse } from '../../services/account.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';

  accounts: CreateAccountResponse[] = [];

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  private sub = new Subscription();

  constructor(private accountsService: AccountService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.error = '';

    this.sub.add(
      this.accountsService.listAccounts(this.page, this.size).subscribe({
        next: (res: PageResponse<CreateAccountResponse>) => {
          this.accounts = res.content ?? [];
          this.page = res.number ?? this.page;
          this.size = res.size ?? this.size;
          this.totalPages = res.totalPages ?? 0;
          this.totalElements = res.totalElements ?? 0;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (err?.status === 403) {
            this.error = 'Access denied. Manager permission required.';
          } else {
            this.error = 'Unable to load accounts. Please try again.';
          }
        },
      })
    );
  }

  prev(): void {
    if (this.page > 0) {
      this.page--;
      this.fetch();
    }
  }

  next(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.fetch();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
