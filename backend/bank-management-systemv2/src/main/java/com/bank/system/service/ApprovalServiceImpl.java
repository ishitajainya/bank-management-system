package com.bank.system.service;

import com.bank.system.dto.ApproveRejectRequest;
import com.bank.system.dto.TransactionResponse;
import com.bank.system.entity.*;
import com.bank.system.exception.BusinessException;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.BankAccountRepository;
import com.bank.system.repository.BankTransactionRepository;
import com.bank.system.repository.UserRepository;
import com.bank.system.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApprovalServiceImpl implements ApprovalService {

    private final BankTransactionRepository bankTransactionRepository;
    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;

    @Override
    public Page<TransactionResponse> pendingApprovals(Pageable pageable) {
        return bankTransactionRepository
                .findByStatusOrderByCreatedAtDesc(ApprovalStatus.PENDING_APPROVAL, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional
    public TransactionResponse approve(Long transactionId, ApproveRejectRequest request) {

        BankTransaction tx = bankTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (tx.getStatus() != ApprovalStatus.PENDING_APPROVAL) {
            throw new BusinessException("Only PENDING_APPROVAL transactions can be approved");
        }

        User manager = getCurrentUser();
        if (manager.getRole() != Role.ROLE_MANAGER) {
            throw new BusinessException("Only MANAGER can approve withdrawals");
        }

        BankAccount account = bankAccountRepository.findByAccountNumber(tx.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + tx.getAccountNumber()));

        // Safety re-check: balance could change between request and approval
        if (account.getBalance().compareTo(tx.getAmount()) < 0) {
            tx.setStatus(ApprovalStatus.REJECTED);
            tx.setApprovedBy(manager);
            tx.setApprovedAt(LocalDateTime.now());
            tx.setRemarks("Rejected due to insufficient balance at approval time");
            bankTransactionRepository.save(tx);
            return toResponse(tx);
        }

        // Deduct balance now
        account.setBalance(account.getBalance().subtract(tx.getAmount()));
        bankAccountRepository.save(account);

        tx.setStatus(ApprovalStatus.COMPLETED);
        tx.setApprovedBy(manager);
        tx.setApprovedAt(LocalDateTime.now());
        tx.setRemarks(request.getRemarks() != null ? request.getRemarks() : "Approved by manager");
        bankTransactionRepository.save(tx);

        return toResponse(tx);
    }

    @Override
    @Transactional
    public TransactionResponse reject(Long transactionId, ApproveRejectRequest request) {

        BankTransaction tx = bankTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (tx.getStatus() != ApprovalStatus.PENDING_APPROVAL) {
            throw new BusinessException("Only PENDING_APPROVAL transactions can be rejected");
        }

        User manager = getCurrentUser();
        if (manager.getRole() != Role.ROLE_MANAGER) {
            throw new BusinessException("Only MANAGER can reject withdrawals");
        }

        tx.setStatus(ApprovalStatus.REJECTED);
        tx.setApprovedBy(manager);
        tx.setApprovedAt(LocalDateTime.now());
        tx.setRemarks(request.getRemarks() != null ? request.getRemarks() : "Rejected by manager");
        bankTransactionRepository.save(tx);

        return toResponse(tx);
    }

    private User getCurrentUser() {
        String username = SecurityUtil.currentUsername();
        if (username == null) throw new BusinessException("Unauthorized");
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private TransactionResponse toResponse(BankTransaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .accountNumber(tx.getAccountNumber())
                .transactionType(tx.getTransactionType())
                .amount(tx.getAmount())
                .status(tx.getStatus())
                .createdAt(tx.getCreatedAt())
                .performedBy(tx.getPerformedBy() != null ? tx.getPerformedBy().getId() : null)
                .approvedBy(tx.getApprovedBy() != null ? tx.getApprovedBy().getId() : null)
                .approvedAt(tx.getApprovedAt())
                .remarks(tx.getRemarks())
                .build();
    }
}
