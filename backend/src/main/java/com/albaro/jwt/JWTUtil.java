package com.albaro.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private SecretKey secretKey;

    //application properties에 미리 저장해 놓은 key 불러오기
    public JWTUtil(@Value("${spring.jwt.secret}")String secret){
        //위에서 받은 secret키를 암호화하기 위한 메서드, 암호화된 키가 secretKey
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());

    }

    //검증을 진행할 3개의 메서드
    //username 데이터, role 값을 뽑아낼 메서드 / 토큰이 만료되었는지를 확인하는 메서드
    //토큰을 전달받아 내부의 jwt parser를 이용하여 내부 데이터 확인
    public String getUsername(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
        // 암호화 되어 있으니깐, 검증 + 클레임을 확인 + payload에서 특정한 데이터를 get을 통해서 확인 get내에서 string 타입 가져온다는 뜻~
    }

    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public String getCategory(String token){
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category",String.class);
    }

    public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public Integer getAccountId(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("accountId", Integer.class);
    }

    public Integer getStoreId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("storeId", Integer.class);
    }

    // 추가한 부분: 연주
    public Integer getUserId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("userId", Integer.class);  // userId 가져오기
    }
    // 여기까지
    
    //토큰 생성할 메서드
    // 연주: userId 추가(nearby-stores에서 조회할 때 accountId로 조회하는게 아니라 userId로 조회함)
    public String createJwt(String category, Integer accountId, String username, String role, Integer storeId,Integer userId, Long expiredMs) {

        return Jwts.builder()
                .claim("category", category) //access, refresh 인지 구분하는 카테고리 매개변수 추가
                .claim("accountId", accountId) //claim 을 통해 특정 속성에 대한 값을 넣어줌
                .claim("username", username)
                .claim("role", role)
                .claim("storeId",storeId)
                .claim("userId", userId)
                .issuedAt(new Date(System.currentTimeMillis())) //현재 발행 시간
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) // 언제 소멸 될 것인지 정하는데, 현재 발행시간에 만료기간 더하면 됨
                .signWith(secretKey) //암호화진행
                .compact(); //토큰 compact
    }


}
