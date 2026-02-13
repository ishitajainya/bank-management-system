package com.bank.system.dto;

import com.bank.system.entity.ApprovalStatus;
import com.bank.system.entity.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionResponse {
    private Long id;
    private String accountNumber;
    private TransactionType transactionType;
    private BigDecimal amount;
    private ApprovalStatus status;
    private LocalDateTime createdAt;

    private Long performedBy;
    private Long approvedBy;
    private LocalDateTime approvedAt;

    private String remarks;
}
