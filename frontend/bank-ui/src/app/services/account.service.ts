import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateAccountResponse {
  accountNumber: string;
  holderName: string;
  balance: number; // backend sends BigDecimal -> JSON number usually
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-based)
  size: number;
  first: boolean;
  last: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  listAccounts(page = 0, size = 10, sort = 'accountNumber,asc'): Observable<PageResponse<CreateAccountResponse>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<PageResponse<CreateAccountResponse>>(`${this.baseUrl}/api/accounts`, { params });
  }
}
