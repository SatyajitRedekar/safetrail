package com.safetravel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SafeTravelApplication {
    public static void main(String[] args) {
        SpringApplication.run(SafeTravelApplication.class, args);
    }
}
