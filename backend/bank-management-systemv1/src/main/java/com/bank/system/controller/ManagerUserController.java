package com.bank.system.controller;

import com.bank.system.dto.CreateClerkRequest;
import com.bank.system.dto.UserResponse;
import com.bank.system.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/users")
@RequiredArgsConstructor
public class ManagerUserController {

    private final UserService userService;

    @PostMapping("/clerk")
    public ResponseEntity<UserResponse> createClerk(@Valid @RequestBody CreateClerkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createClerk(request));
    }
}
