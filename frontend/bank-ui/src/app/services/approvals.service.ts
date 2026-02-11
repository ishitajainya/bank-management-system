import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ApproveRejectRequest {
  remarks?: string;
}

@Injectable({ providedIn: 'root' })
export class ApprovalsService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  pending(page = 0, size = 10) {
    return this.http.get<any>(`${this.baseUrl}/api/approvals/pending?page=${page}&size=${size}`);
  }

  approve(transactionId: number, remarks?: string) {
    const body: ApproveRejectRequest = { remarks };
    return this.http.post<any>(`${this.baseUrl}/api/approvals/${transactionId}/approve`, body);
  }

  reject(transactionId: number, remarks?: string) {
    const body: ApproveRejectRequest = { remarks };
    return this.http.post<any>(`${this.baseUrl}/api/approvals/${transactionId}/reject`, body);
  }
}
