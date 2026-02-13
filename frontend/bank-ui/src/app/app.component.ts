import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showNav = false;

  constructor(private router: Router, private auth: AuthService) {
    // initial
    this.updateNavbarVisibility(this.router.url);

    // on route changes
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateNavbarVisibility(this.router.url));

    // optional: also respond instantly to login/logout
    this.auth.token$.subscribe(() => this.updateNavbarVisibility(this.router.url));
  }

  private updateNavbarVisibility(url: string) {
    const onLoginPage = url.startsWith('/login');
    const loggedIn = this.auth.isLoggedIn();

    // ✅ show navbar only when logged in AND not on login page
    this.showNav = loggedIn && !onLoginPage;
  }
}
