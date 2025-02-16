package com.albaro.controller;

import com.albaro.entity.RefreshEntity;
import com.albaro.jwt.JWTUtil;
import com.albaro.repository.RefreshRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

@Controller
@ResponseBody //특정 응답 데이터만 받을 거라서!
public class ReissueController {

    //jwt를 받아서 검증하고, 새로운 jwt를 응답해주는 controller임

    //jwtUtil(jwt 검증 및 관리함) 클래스 주입
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public ReissueController(JWTUtil jwtUtil, RefreshRepository refreshRepository){
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response){

        //token 꺼내 오기
        String refresh = null; //cookie에서 뽑아낼 refresh token
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            //쿠키 순환해서 키 값 중 refresh키 값 찾기
            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue(); // 꺼내서 넣기
            }
        }

        if (refresh == null) {

            //response status code
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        //토큰 만료 check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //DB에 저장되어 있는지 확인
        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        if (!isExist) {

            //response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        Integer accountId = jwtUtil.getAccountId(refresh);
        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        Integer storeId = jwtUtil.getStoreId(refresh);
        Integer userId = jwtUtil.getUserId(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access",accountId , username, role, storeId, userId, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", accountId, username, role, storeId, userId,86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshRepository.deleteByRefresh(refresh);
        addRefreshEntity(accountId, newRefresh, storeId, 86400000L);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }
    private void addRefreshEntity(Integer accountId, String refresh, Integer storeId, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        RefreshEntity refreshEntity = new RefreshEntity();
        refreshEntity.setAccountId(accountId);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        refreshRepository.save(refreshEntity);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
//cookie.setSecure(true);//cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }


}
