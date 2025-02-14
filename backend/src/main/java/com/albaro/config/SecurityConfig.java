//package com.albaro.dto;
//
//public class JoinDto {
//
//    private int accountId;
//    private String password;
//    private String role;
//
//    public JoinDto(){
//
//    }
//
//    public JoinDto(int accountId, String password, String role) {
//        this.accountId = accountId;
//        this.password = password;
//        this.role = role;
//    }
//
//    public int getAccountId() {
//        return accountId;
//    }
//
//    public void setAccountId(int accountId) {
//        this.accountId = accountId;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public String getRole() {
//        return role;
//    }
//
//    public void setRole(String role) {
//        this.role = role;
//    }
//}
//package com.albaro.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/ws/**").permitAll() // WebSocket 엔드포인트 허용
//                        .anyRequest().authenticated()
//                )
//                .csrf(csrf -> csrf.disable()); // CSRF 비활성화 (WebSocket 사용 시 필요)
//
//        return http.build();
//    }
//}

