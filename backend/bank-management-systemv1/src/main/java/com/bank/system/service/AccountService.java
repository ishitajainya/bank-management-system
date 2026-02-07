package com.bank.system.service;

import com.bank.system.dto.CreateAccountRequest;
import com.bank.system.dto.CreateAccountResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    CreateAccountResponse createAccount(CreateAccountRequest request);
    Page<CreateAccountResponse> listAccounts(Pageable pageable);
}
