package com.bank.system.service;

import com.bank.system.dto.CreateAccountRequest;
import com.bank.system.dto.CreateAccountResponse;

public interface AccountService {
    CreateAccountResponse createAccount(CreateAccountRequest request);
}
