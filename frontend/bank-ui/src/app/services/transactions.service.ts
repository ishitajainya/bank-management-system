import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface DepositRequest {
  accountNumber: string;
  amount: number;
}

export interface WithdrawRequest {
  accountNumber: string;
  amount: number;
}


export interface Transaction {
  id: number;
  accountNumber: string;
  transactionType: string;
  amount: number;
  status: string;
  createdAt: string;
  performedBy?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  deposit(req: DepositRequest) {
    return this.http.post<any>(
      `${this.baseUrl}/api/transactions/deposit`,
      req
    );
  }

  withdraw(req: WithdrawRequest) {
    return this.http.post<any>(
      `${this.baseUrl}/api/transactions/withdraw`,
      req
    );
  }

  getAccountTransactions(
    accountNumber: string,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<Transaction>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Transaction>>(
      `${this.baseUrl}/api/accounts/${accountNumber}/transactions`,
      { params }
    );
  }
}
