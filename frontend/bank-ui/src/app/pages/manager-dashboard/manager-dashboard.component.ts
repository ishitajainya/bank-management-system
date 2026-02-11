import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ApprovalsService } from '../../services/approvals.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  greeting = '';
  username = '';

  approvals: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  isLoading = false;
  actionLoadingId: number | null = null;

  error = '';
  success = '';

  constructor(
    private auth: AuthService,
    private approvalsService: ApprovalsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.auth.getUsername() || '';
    this.setGreeting();
    this.loadPending();
  }

  private setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  private clearMessages() {
    this.error = '';
    this.success = '';
  }

  loadPending() {
    this.clearMessages();
    this.isLoading = true;

    this.approvalsService
      .pending(this.page, this.size)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.approvals = res.content || [];
          this.totalPages = res.totalPages || 0;
          this.totalElements = res.totalElements || 0;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load pending approvals.';
        }
      });
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadPending();
    }
  }

  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadPending();
    }
  }

  approve(txId: number) {
    this.clearMessages();
    const remarks = prompt('Remarks (optional):', 'Approved after verification') || undefined;

    this.actionLoadingId = txId;
    this.approvalsService
      .approve(txId, remarks)
      .pipe(finalize(() => (this.actionLoadingId = null)))
      .subscribe({
        next: () => {
          this.success = `Approved transaction #${txId}.`;
          this.loadPending();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Approve failed.';
        }
      });
  }

  reject(txId: number) {
    this.clearMessages();
    const remarks = prompt('Rejection reason:', 'Rejected due to verification issue');
    if (!remarks || !remarks.trim()) {
      this.error = 'Rejection requires remarks.';
      return;
    }

    this.actionLoadingId = txId;
    this.approvalsService
      .reject(txId, remarks.trim())
      .pipe(finalize(() => (this.actionLoadingId = null)))
      .subscribe({
        next: () => {
          this.success = `Rejected transaction #${txId}.`;
          this.loadPending();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Reject failed.';
        }
      });
  }
  logout() {
    this.auth.logout(); 
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
