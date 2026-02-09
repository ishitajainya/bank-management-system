package com.bank.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateClerkRequest {

    @NotBlank
    @Size(min = 4, max = 30)
    private String username;

    @NotBlank
    @Size(min = 6, max = 50)
    private String password;
}
