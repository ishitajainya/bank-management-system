package com.bank.system;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BankManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankManagementSystemApplication.class, args);
    }

    // temp
//    @Bean
//    CommandLineRunner printHash() {
//        return args -> {
//            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//            System.out.println("BCrypt hash: " + encoder.encode("Password@123"));
//        };
//    }
}
