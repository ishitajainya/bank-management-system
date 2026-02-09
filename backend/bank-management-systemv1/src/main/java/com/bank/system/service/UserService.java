package com.bank.system.service;

import com.bank.system.dto.CreateClerkRequest;
import com.bank.system.dto.UserResponse;

public interface UserService {
    UserResponse createClerk(CreateClerkRequest request);
}
