package com.bank.system.controller;

import com.bank.system.dto.DepositRequest;
import com.bank.system.dto.TransactionResponse;
import com.bank.system.dto.WithdrawRequest;
import com.bank.system.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clerk")
@RequiredArgsConstructor
public class ClerkTransactionController {

    private final TransactionService transactionService;

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(transactionService.deposit(request));
    }

    // Withdraw (auto-complete if <= 2L, pending if > 2L)
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@Valid @RequestBody WithdrawRequest request) {
        return ResponseEntity.ok(transactionService.withdraw(request));
    }

    // Account transaction history (paged)
    // Example: GET /api/clerk/accounts/YMSLIXXXX1234/transactions?page=0&size=10
    @GetMapping("/accounts/{accountNumber}/transactions")
    public ResponseEntity<Page<TransactionResponse>> history(
            @PathVariable String accountNumber,
            Pageable pageable
    ) {
        return ResponseEntity.ok(transactionService.accountHistory(accountNumber, pageable));
    }
}
