package com.bank.system.repository;

import com.bank.system.entity.ApprovalStatus;
import com.bank.system.entity.BankTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {

    // transaction history of an account (latest first)
    Page<BankTransaction> findByAccountNumberOrderByCreatedAtDesc(String accountNumber, Pageable pageable);

    // pending approvals list (latest first)
    Page<BankTransaction> findByStatusOrderByCreatedAtDesc(ApprovalStatus status, Pageable pageable);
    
    long countByStatus(ApprovalStatus status);

}
