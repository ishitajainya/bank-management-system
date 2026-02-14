package com.bank.system.controller;

import com.bank.system.dto.*;
import com.bank.system.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BankController {

    private final AccountService accountService;
    private final TransactionService transactionService;
    private final ApprovalService approvalService;
    private final UserService userService;

   //create accounts (mgr is logged in)

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/accounts")
    public ResponseEntity<CreateAccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(accountService.createAccount(request));
    }

    
    //mgr can view all bank accounts
    
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/accounts")
    public ResponseEntity<Page<CreateAccountResponse>> listAccounts(Pageable pageable) {
        return ResponseEntity.ok(accountService.listAccounts(pageable));
    }

    //create clerk (sign up of clerk)

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/users/clerk")
    public ResponseEntity<UserResponse> createClerk(
            @Valid @RequestBody CreateClerkRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createClerk(request));
    }

    //deposit req that clerk will fulfill (clerk should be logged in)

    @PreAuthorize("hasRole('CLERK')")
    @PostMapping("/transactions/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @Valid @RequestBody DepositRequest request
    ) {
        return ResponseEntity.ok(transactionService.deposit(request));
    }

    
   //withdrawal req that clerk will fulfill (clerk should be logged in)
    
    @PreAuthorize("hasRole('CLERK')")
    @PostMapping("/transactions/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @Valid @RequestBody WithdrawRequest request
    ) {
        return ResponseEntity.ok(transactionService.withdraw(request));
    }

    
    //view all txns of an account (either clerk or manager is logged in)
    @PreAuthorize("hasAnyRole('CLERK','MANAGER')")
    @GetMapping("/accounts/{accountNumber}/transactions")
    public ResponseEntity<Page<TransactionResponse>> history(
            @PathVariable String accountNumber,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                transactionService.accountHistory(accountNumber, pageable)
        );
    }

   //pending approvals (manager should be logged in)

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/approvals/pending")
    public ResponseEntity<Page<TransactionResponse>> pendingApprovals(Pageable pageable) {
        return ResponseEntity.ok(approvalService.pendingApprovals(pageable));
    }

    
   //manager approval (manager should be logged in)

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/approvals/{transactionId}/approve")
    public ResponseEntity<TransactionResponse> approve(
            @PathVariable Long transactionId,
            @RequestBody ApproveRejectRequest request
    ) {
        return ResponseEntity.ok(
                approvalService.approve(transactionId, request)
        );
    }

    
  //manager rejects (manager should be logged in)
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/approvals/{transactionId}/reject")
    public ResponseEntity<TransactionResponse> reject(
            @PathVariable Long transactionId,
            @RequestBody ApproveRejectRequest request
    ) {
        return ResponseEntity.ok(
                approvalService.reject(transactionId, request)
        );
    }
}
