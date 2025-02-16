//package com.albaro.config;

//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.authentication.logout.LogoutFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//
//import java.util.Collections;
//
//@Configuration
//@EnableWebSecurity //이 클래스가 security를 위한 config라는 뜻
//public class SecurityConfig {
//
//    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
//    private final AuthenticationConfiguration authenticationConfiguration;
//    private final JWTUtil jwtUtil;
//    private final RefreshRepository refreshRepository;
//
//    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, RefreshRepository refreshRepository) {
//
//        this.authenticationConfiguration = authenticationConfiguration;
//        this.jwtUtil = jwtUtil;
//        this.refreshRepository = refreshRepository;
//    }
//
//    //AuthenticationManager Bean 등록@Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
//
//        return configuration.getAuthenticationManager();
//    }
//
//    @Bean
//    public BCryptPasswordEncoder bCryptPasswordEncoder() {
//        //비밀번호를 캐시에 암호화하기 위함
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
//
//        http
//                .cors((cors) -> cors.configurationSource(new CorsConfigurationSource() {
//                    //람다식으로 변수 생성하는 것이고, 저기 안에서 생성자 만들고 override 까지 할 수 있음
//                    @Override
//                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//
//                        CorsConfiguration configuration = new CorsConfiguration();
//
//                        //허용할 프론트엔드 서버 번호
//                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
//                        // 모든 방식 허용(GET,POST 등등)
//                        configuration.setAllowedMethods(Collections.singletonList("*"));
//                        configuration.setAllowCredentials(true);
//                        configuration.setAllowedHeaders(Collections.singletonList("*"));
//                        configuration.setMaxAge(3600L);
//
//                        //Authorization에 넣을 거기 때문에 header 허용..?
//                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
//
//
//
//                        return null;
//                    }
//                }));
//
//        //csrf disable
//        //session을 stateless 상태로 관리 -> csrf의 공격을 방어하지 않아도 됨
//        http
//                .csrf((auth) -> auth.disable());
//
//        //From 로그인 방식 disable
//        http
//                .formLogin((auth) -> auth.disable());
//
//        //http basic 인증 방식 disable
//        http
//                .httpBasic((auth) -> auth.disable());
//
//        //경로별 인가 작업(권한에 대한 내용)
//        http
//                .authorizeHttpRequests((auth) -> auth
//                        .requestMatchers("/login", "/", "/join").permitAll() //모든 권한 허용
//                        .requestMatchers("/admin").hasRole("ADMIN") //관리자만
//                        .requestMatchers("/manager").hasRole("manager")
//                        .requestMatchers("/reissue").permitAll() //이때는 로그인 불가능이라서 허용 시켜줘야 함
//                        .anyRequest().authenticated());
//        //이외의 요청에는 로그인한 사용자만 하도록
//
//        //로그인 필터 앞에 jwtfilter 넣을 것임
//        http
//                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
//
//
//        //필터 추가 LoginFilter()는 인자를 받음 (AuthenticationManager() 메소드에 authenticationConfiguration 객체를 넣어야 함) 따라서 등록 필요
//        http
//                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil, refreshRepository), UsernamePasswordAuthenticationFilter.class);
//
//        //원래 내장되어 있는 로그아웃 필터 앞에 우리가 만든 로그아웃 필터 넣기
//        http
//                .addFilterBefore(new CustomLogoutFilter(jwtUtil,refreshRepository), LogoutFilter.class);
//
//        //세션 설정
//        http
//                .sessionManagement((session) -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//
//
//        return http.build();
//    }
//}
