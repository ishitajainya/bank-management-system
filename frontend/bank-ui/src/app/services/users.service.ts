import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateClerkRequest {
  username: string;
  password: string;
  confirmPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  createClerk(req: CreateClerkRequest) {
    return this.http.post<any>(`${this.baseUrl}/api/users/clerk`, req);
  }
}
