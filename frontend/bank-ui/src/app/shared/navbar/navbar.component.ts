import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnDestroy {
  role: string | null = null;
  username: string | null = null;
  isLoginPage = false;
  isAuthenticated = false;
  private sub = new Subscription();

  constructor(private auth: AuthService, private router: Router) {
    // Subscribe to auth state
    this.sub.add(this.auth.role$.subscribe((r) => (this.role = r)));
    this.sub.add(this.auth.username$.subscribe((u) => (this.username = u)));

    // Detect route changes
    this.sub.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.isLoginPage = event.urlAfterRedirects === '/login';
        })
    );

    // Initial check (important on page refresh)
    this.isLoginPage = this.router.url === '/login';
  }
  ngOnInit() {
    this.isAuthenticated = !!localStorage.getItem('token'); 
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
