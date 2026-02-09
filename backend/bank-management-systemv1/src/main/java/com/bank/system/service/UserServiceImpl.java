package com.bank.system.service;

import com.bank.system.dto.CreateClerkRequest;
import com.bank.system.dto.UserResponse;
import com.bank.system.entity.Role;
import com.bank.system.entity.User;
import com.bank.system.exception.BusinessException;
import com.bank.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createClerk(CreateClerkRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists");
        }

        User saved = userRepository.save(
                User.builder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .role(Role.ROLE_CLERK)
                        .enabled(true)
                        .build()
        );

        return UserResponse.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .role(saved.getRole().name())
                .enabled(saved.isEnabled())
                .build();
    }
}
