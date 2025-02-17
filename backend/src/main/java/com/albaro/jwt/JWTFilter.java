package com.albaro.jwt;

import com.albaro.dto.CustomUserDetails;
import com.albaro.entity.User;
// 추가한 부분(연주)
import com.albaro.entity.Store;
// 여기까지
import com.albaro.repository.StoreRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.ExpiredJwtException;

import java.io.IOException;
import java.io.PrintWriter;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // 추가한 부분(연주)
    private StoreRepository storeRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

//        System.out.println("혹시....여기.............?")

        String accessToken = request.getHeader("access");  // access 헤더에서 토큰 추출

        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals("access")) {
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        int accountId = jwtUtil.getAccountId(accessToken);
        String role = jwtUtil.getRole(accessToken);
        // 추가한 부분(연주)
        String username = jwtUtil.getUsername(accessToken);  // username 추가
        int storeId = jwtUtil.getStoreId(accessToken);  // storeId 추가
        int userId = jwtUtil.getUserId(accessToken);  // userId 추가
        // 여기까지

        User userEntity = new User();
        userEntity.setAccountId(accountId);
        userEntity.setRole(role);
        // 추가한 부분(연주)
        userEntity.setUserName(username);
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found"));
        userEntity.setStore(store);
        userEntity.setUserId(userId);  // userId 설정
        // 여기까지
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);

        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}