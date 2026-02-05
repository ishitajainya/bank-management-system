package com.bank.system.service;

import com.bank.system.dto.CreateAccountRequest;
import com.bank.system.dto.CreateAccountResponse;
import com.bank.system.entity.BankAccount;
import com.bank.system.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final BankAccountRepository bankAccountRepository;

    @Override
    @Transactional
    public CreateAccountResponse createAccount(CreateAccountRequest request) {

        BigDecimal opening = request.getOpeningBalance();
        if (opening.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Opening balance cannot be negative");
        }

        String accountNumber = generateAccountNumber();

        BankAccount account = BankAccount.builder()
                .accountNumber(accountNumber)
                .holderName(request.getHolderName())
                .balance(opening)
                .build();

        BankAccount saved = bankAccountRepository.save(account);

        return CreateAccountResponse.builder()
                .accountNumber(saved.getAccountNumber())
                .holderName(saved.getHolderName())
                .balance(saved.getBalance())
                .build();
    }

    private String generateAccountNumber() {
        return "YMSLI" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}
