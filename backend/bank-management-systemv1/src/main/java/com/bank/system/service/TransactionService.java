package com.bank.system.service;

import com.bank.system.dto.DepositRequest;
import com.bank.system.dto.TransactionResponse;
import com.bank.system.dto.WithdrawRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionResponse deposit(DepositRequest request);
    TransactionResponse withdraw(WithdrawRequest request);
    Page<TransactionResponse> accountHistory(String accountNumber, Pageable pageable);
}
