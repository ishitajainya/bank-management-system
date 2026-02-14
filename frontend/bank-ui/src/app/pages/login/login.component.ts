import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  remember = true;
  showPassword = false;

  isLoading = false;

  // Use ONE error field (cleaner). You can delete errorMessage if unused in HTML.
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const u = this.username.trim();
    const p = this.password;

    this.error = '';

    if (!u || !p) {
      this.error = 'Please enter your username and password.';
      return;
    }

    this.isLoading = true;

    this.auth
      .login(u, p)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.auth.saveSession(res.token, res.role, res.username);

          if (res.role === 'ROLE_MANAGER') {
            this.router.navigate(['/manager']);
          } else {
            this.router.navigate(['/clerk']);
          }
        },
        error: (err) => {
          this.error = this.getFriendlyError(err);
          console.error('Login API error:', err); // dev-only details
        },
      });
  }

  private getFriendlyError(err: any): string {
    // Server down / network error / CORS often shows status 0
    if (err?.status === 0) {
      return 'Unable to connect to the server right now. Please try again in a moment.';
    }

    // Wrong credentials
    if (err?.status === 401) {
      return 'Invalid username or password. Please try again.';
    }

    // No permission
    if (err?.status === 403) {
      return 'You don’t have permission to access this application.';
    }

    // Server error
    if (err?.status >= 500) {
      return 'Service is temporarily unavailable. Please try again later.';
    }

    // If backend sends a clean message (optional)
    const apiMsg =
      err?.error?.message ||
      err?.error?.error ||
      err?.error?.detail;

    if (typeof apiMsg === 'string' && apiMsg.trim().length > 0) {
      return apiMsg;
    }

    return 'Something went wrong. Please try again.';
  }
}
