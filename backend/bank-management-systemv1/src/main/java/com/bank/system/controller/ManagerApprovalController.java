package com.bank.system.controller;

import com.bank.system.dto.ApproveRejectRequest;
import com.bank.system.dto.TransactionResponse;
import com.bank.system.service.ApprovalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerApprovalController {

    private final ApprovalService approvalService;

    // View all pending approvals (paged)
    // Example: GET /api/manager/withdrawals/pending?page=0&size=10
    @GetMapping("/withdrawals/pending")
    public ResponseEntity<Page<TransactionResponse>> pending(Pageable pageable) {
        return ResponseEntity.ok(approvalService.pendingApprovals(pageable));
    }

    //Approve a pending withdrawal
    @PostMapping("/withdrawals/{transactionId}/approve")
    public ResponseEntity<TransactionResponse> approve(
            @PathVariable Long transactionId,
            @Valid @RequestBody ApproveRejectRequest request
    ) {
        return ResponseEntity.ok(approvalService.approve(transactionId, request));
    }

    // Reject a pending withdrawal
    @PostMapping("/withdrawals/{transactionId}/reject")
    public ResponseEntity<TransactionResponse> reject(
            @PathVariable Long transactionId,
            @Valid @RequestBody ApproveRejectRequest request
    ) {
        return ResponseEntity.ok(approvalService.reject(transactionId, request));
    }
}
