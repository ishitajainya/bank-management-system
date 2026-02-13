import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  // ✅ reactive session state
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  token$ = this.tokenSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  role$ = this.roleSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, { username, password });
  }

  // ✅ store + notify UI (navbar) immediately
  saveSession(token: string, role: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);

    // notify subscribers (Navbar/App)
    this.tokenSubject.next(token);
    this.roleSubject.next(role);
    this.usernameSubject.next(username);
  }

  getToken(): string | null {
    return this.tokenSubject.value ?? localStorage.getItem('token');
  }

  getRole(): string | null {
    return this.roleSubject.value ?? localStorage.getItem('role');
  }

  getUsername(): string | null {
    return this.usernameSubject.value ?? localStorage.getItem('username');
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

    // notify subscribers
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
    this.usernameSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
