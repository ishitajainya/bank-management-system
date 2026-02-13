import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountsService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createAccount(body: { holderName: string; openingBalance: number }) {
  return this.http.post(`${this.baseUrl}/api/accounts`, body);
}

}
