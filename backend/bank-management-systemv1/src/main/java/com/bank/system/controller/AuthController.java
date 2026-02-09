package com.bank.system.controller;

import com.bank.system.dto.LoginRequest;
import com.bank.system.dto.LoginResponse;
import com.bank.system.entity.User;
import com.bank.system.repository.UserRepository;
import com.bank.system.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
}
