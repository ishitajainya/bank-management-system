import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  remember = true;
  showPassword = false;
  isLoading = false;

  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    const u = this.username.trim();
    const p = this.password;

    this.error = '';

    if (!u || !p) {
      this.error = 'Please enter your username and password.';
      return;
    }

    this.isLoading = true;

    this.auth.login(u, p)
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
          this.error =
            err?.error?.message ||
            err?.message ||
            'Invalid username or password';
        }
      });
  }
}
