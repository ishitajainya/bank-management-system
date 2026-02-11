package com.bank.system.service;

import com.bank.system.dto.DepositRequest;
import com.bank.system.dto.TransactionResponse;
import com.bank.system.dto.WithdrawRequest;
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

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private static final BigDecimal HIGH_VALUE_LIMIT = new BigDecimal("200000.00");

    private final BankAccountRepository bankAccountRepository;
    private final BankTransactionRepository bankTransactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {

        BankAccount account = bankAccountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + request.getAccountNumber()));

        User clerk = getCurrentUser();
        if (clerk.getRole() != Role.ROLE_CLERK) {
            throw new BusinessException("Only CLERK can perform deposit");
        }

        BigDecimal amount = request.getAmount();
        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new BusinessException("Amount must be > 0");

        account.setBalance(account.getBalance().add(amount));
        bankAccountRepository.save(account);

        BankTransaction tx = bankTransactionRepository.save(
                BankTransaction.builder()
                        .accountNumber(account.getAccountNumber())
                        .transactionType(TransactionType.DEPOSIT)
                        .amount(amount)
                        .performedBy(clerk)
                        .status(ApprovalStatus.COMPLETED)
                        .remarks("Deposit successful")
                        .build()
        );

        return toResponse(tx);
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {

        BankAccount account = bankAccountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + request.getAccountNumber()));

        User clerk = getCurrentUser();
        if (clerk.getRole() != Role.ROLE_CLERK) {
            throw new BusinessException("Only CLERK can initiate withdrawal");
        }

        BigDecimal amount = request.getAmount();
        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new BusinessException("Amount must be > 0");

      
        if (account.getBalance().compareTo(amount) < 0) {
            throw new BusinessException("Insufficient balance");
        }

        // High-value -> pending approval (balance not updated)
        if (amount.compareTo(HIGH_VALUE_LIMIT) > 0) {
            BankTransaction tx = bankTransactionRepository.save(
                    BankTransaction.builder()
                            .accountNumber(account.getAccountNumber())
                            .transactionType(TransactionType.WITHDRAWAL)
                            .amount(amount)
                            .performedBy(clerk)
                            .status(ApprovalStatus.PENDING_APPROVAL)
                            .remarks("High value withdrawal - pending manager approval")
                            .build()
            );
            return toResponse(tx);
        }

        // Normal withdrawal
        account.setBalance(account.getBalance().subtract(amount));
        bankAccountRepository.save(account);

        BankTransaction tx = bankTransactionRepository.save(
                BankTransaction.builder()
                        .accountNumber(account.getAccountNumber())
                        .transactionType(TransactionType.WITHDRAWAL)
                        .amount(amount)
                        .performedBy(clerk)
                        .status(ApprovalStatus.COMPLETED)
                        .remarks("Withdrawal successful")
                        .build()
        );

        return toResponse(tx);
    }

    @Override
    public Page<TransactionResponse> accountHistory(String accountNumber, Pageable pageable) {
        return bankTransactionRepository.findByAccountNumberOrderByCreatedAtDesc(accountNumber, pageable)
                .map(this::toResponse);
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
