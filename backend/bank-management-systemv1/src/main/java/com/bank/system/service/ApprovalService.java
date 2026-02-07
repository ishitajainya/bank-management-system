package com.bank.system.service;

import com.bank.system.dto.ApproveRejectRequest;
import com.bank.system.dto.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApprovalService {
    Page<TransactionResponse> pendingApprovals(Pageable pageable);
    TransactionResponse approve(Long transactionId, ApproveRejectRequest request);
    TransactionResponse reject(Long transactionId, ApproveRejectRequest request);
}
