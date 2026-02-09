package com.bank.system.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    private Long id;
    private String username;
    private String role;
    private boolean enabled;
}
