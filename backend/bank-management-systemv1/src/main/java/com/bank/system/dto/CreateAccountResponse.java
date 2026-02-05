package com.bank.system.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAccountResponse {
    private String accountNumber;
    private String holderName;
    private BigDecimal balance;
}
