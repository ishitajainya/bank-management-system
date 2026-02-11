import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface DepositRequest {
  accountNumber: string;
  amount: number;
}

export interface WithdrawRequest {
  accountNumber: string;
  amount: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  deposit(req: DepositRequest) {
    return this.http.post<any>(`${this.baseUrl}/api/transactions/deposit`, req);
  }

  withdraw(req: WithdrawRequest) {
    return this.http.post<any>(`${this.baseUrl}/api/transactions/withdraw`, req);
  }
}
