package com.albaro.jwt;

import com.albaro.dto.CustomUserDetails;
import com.albaro.entity.RefreshEntity;
import com.albaro.repository.RefreshRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private RefreshRepository refreshRepository;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshRepository refreshRepository){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        setFilterProcessesUrl("/api/auth/login");  // 로그인 경로 변경
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        System.out.println("ddddddddd");


        //클라이언트 요청에서 accountId, password 추출
        String accountId = request.getParameter("accountId"); //사원번호
        String password = obtainPassword(request); //비밀번호

        System.out.println("Received login attempt - AccountId: " + accountId);
        System.out.println("Received login attempt - password: " + password);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(accountId, password, null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {


        System.out.println("dhfjdhfkjdhfkjdhfkjdkfhjdhfkdwjhfkjdhfkjdhfkjdhfkjdhfkjdhfkdjhfkjdhfkdhfkj");

        //유저 정보
        String username = authentication.getName();

        // CustomUserDetails를 통해 storeId,accountId 가져오기
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer storeId = Integer.parseInt(userDetails.getStoreId());
        Integer userId = Integer.parseInt(userDetails.getUserId());
        Integer accountId = Integer.parseInt(userDetails.getAccountId());


        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성 ( 생명 주기를 달리 하는 2가지 토큰 생성)
        String access = jwtUtil.createJwt("access", accountId, username, role, storeId, userId,600000L);
        String refresh = jwtUtil.createJwt("refresh", accountId, username, role, storeId, userId, 86400000L);

        System.out.println("Access Token Info:");
        System.out.println("AccountId: " + jwtUtil.getAccountId(access));
        System.out.println("Username: " + jwtUtil.getUsername(access));
        System.out.println("Role: " + jwtUtil.getRole(access));
        System.out.println("StoreId: " + jwtUtil.getStoreId(access));
        System.out.println("Category: " + jwtUtil.getCategory(access));



        System.out.println("Access Token Info:");
        System.out.println("AccountId: " + jwtUtil.getAccountId(access));
        System.out.println("Username: " + jwtUtil.getUsername(access));
        System.out.println("Role: " + jwtUtil.getRole(access));
        System.out.println("StoreId: " + jwtUtil.getStoreId(access));
        System.out.println("Category: " + jwtUtil.getCategory(access));



        //리프레시 토큰을 저장소에 저장 -> 메서드는 따로 밑에 있음
        addRefreshEntity(accountId, refresh, 86400000L);

        //응답 설정
        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh)); //쿠키에 리프레시토큰 넣는 것
        response.setStatus(HttpStatus.OK.value());

    }

    //리프레시 토큰을 저장소에 저장 -> 따로 메서드 구현
    private void addRefreshEntity(Integer accountId, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs); //만료 일자

        //refreshEntity 만들어서 전달받은 값들 초기화 하는 과정
        RefreshEntity refreshEntity = new RefreshEntity();
        refreshEntity.setAccountId(accountId);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        refreshRepository.save(refreshEntity); //해당 토큰 저장
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(401);
//        System.out.println("fail");
    }

    //첫번째 인자는 key값, 두번째 인자는 jwt가 들어갈 value 값
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);  // HTTPS 설정 추가
        cookie.setPath("/");    // 경로 설정 추가
//        cookie.setDomain("i12b105.p.ssafy.io"); // 도메인 설정
        cookie.setDomain("localhost");
        return cookie;
    }
}
