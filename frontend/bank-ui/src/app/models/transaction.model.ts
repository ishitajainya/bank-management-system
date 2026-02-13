export interface Transaction {
  id: number;
  accountNumber: string;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string;
  createdAt: string; // ISO
  performedBy?: string; // optional (if your API returns it)
}

export interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number; // current page (0-based)
  size?: number;
}
