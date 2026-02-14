package com.bank.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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
