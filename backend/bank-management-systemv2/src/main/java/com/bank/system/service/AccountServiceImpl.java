package com.bank.system.service;

import com.bank.system.dto.CreateAccountRequest;
import com.bank.system.dto.CreateAccountResponse;
import com.bank.system.entity.BankAccount;
import com.bank.system.exception.BusinessException;
import com.bank.system.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            throw new BusinessException("Opening balance cannot be negative");
        }

        String accountNumber = generateAccountNumber();

        BankAccount saved = bankAccountRepository.save(
                BankAccount.builder()
                        .accountNumber(accountNumber)
                        .holderName(request.getHolderName())
                        .balance(opening)
                        .build()
        );

        return CreateAccountResponse.builder()
                .accountNumber(saved.getAccountNumber())
                .holderName(saved.getHolderName())
                .balance(saved.getBalance())
                .build();
    }

    @Override
    public Page<CreateAccountResponse> listAccounts(Pageable pageable) {
        return bankAccountRepository.findAll(pageable)
                .map(a -> CreateAccountResponse.builder()
                        .accountNumber(a.getAccountNumber())
                        .holderName(a.getHolderName())
                        .balance(a.getBalance())
                        .build());
    }

    private String generateAccountNumber() {
        return "YMSLI" + UUID.randomUUID().toString().replace("-", "")
                .substring(0, 8).toUpperCase();
    }
}
