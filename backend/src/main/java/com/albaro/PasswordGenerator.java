// src/main/java/com/albaro/util/PasswordGenerator.java
package com.albaro.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // 현재 DB에 있는 평문 비밀번호들
        String[] passwords = {
                "Mega2025!@",    // 김지원
                "Staff#4851",    // 이성민
                "Work@2024",     // 박서연
                "Cafe24Hr!"      // 정민우
        };

        // 인코딩된 비밀번호 출력
        for (String password : passwords) {
            String encoded = encoder.encode(password);
            System.out.println("원본: " + password);
            System.out.println("인코딩: " + encoded);
            System.out.println();
        }
    }
}