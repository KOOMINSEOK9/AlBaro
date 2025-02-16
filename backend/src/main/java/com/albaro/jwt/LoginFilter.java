
package com.albaro.jwt;

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
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        //클라이언트 요청에서 accountId, password 추출
        String accountId = request.getParameter("accountId");
        String password = obtainPassword(request);

        //스프링 시큐리티에서 accountId과 password를 검증하기 위해서는 token 바구니에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(accountId, password, null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication){

        //유저 정보
        //함수는 getName이지만, accountId를 가져올 수 있도록 해 놓음!
//        String stringAccountId = authentication.getName();
        Integer accountId = Integer.parseInt(authentication.getName());

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성 ( 생명 주기를 달리 하는 2가지 토큰 생성)
        String access = jwtUtil.createJwt("access", accountId, role, 600000L);
        String refresh = jwtUtil.createJwt("refresh", accountId, role, 86400000L);

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
        cookie.setMaxAge(24*60*60); //쿠키의 생명주기
        //cookie.setSecure(true); //https로 쓸 때 사용  cookie.setPath("/"); //쿠키가 적용될 범위 설정
        cookie.setHttpOnly(true); //httponly 설정 필수!!

        return cookie;
    }
}
