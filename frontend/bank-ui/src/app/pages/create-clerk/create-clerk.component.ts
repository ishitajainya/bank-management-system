import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-create-clerk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-clerk.component.html',
  styleUrls: ['./create-clerk.component.css']
})
export class CreateClerkComponent implements OnInit {
  greeting = '';
  managerUsername = '';

  username = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  isLoading = false;

  success = '';
  error = '';

  constructor(
    private auth: AuthService,
    private users: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.auth.getRole();
    if (!this.auth.isLoggedIn() || role !== 'ROLE_MANAGER') {
      this.router.navigate(['/login']);
      return;
    }

    this.managerUsername = this.auth.getUsername() || '';
    this.setGreeting();
  }

  private setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  private clearMessages() {
    this.success = '';
    this.error = '';
  }

  createClerk() {
    this.clearMessages();

    const u = this.username.trim();
    if (!u) {
      this.error = 'Username is required.';
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.users.createClerk({
      username: u,
      password: this.password,
      confirmPassword: this.confirmPassword
    })
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe({
      next: () => {
        this.success = `Clerk user "${u}" created successfully.`;
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to create clerk.';
      }
    });
  }

  backToManager() {
    this.router.navigate(['/manager']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
