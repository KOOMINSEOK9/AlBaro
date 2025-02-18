package com.albaro.service;

import com.albaro.QRcode.UserQRData;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import net.glxn.qrgen.javase.QRCode;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {
    private final String secretKey = "djfhdjhfjdkhfkdf"; //jwt토큰 생성 및 검증에 사용할 비밀키

    public byte[] generateEmployeeQR(Long userId){

        try{

            //직원 정보를 포함한 데이터(Map) 생성
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", userId);
            payload.put("timestamp", Instant.now().getEpochSecond());

            //JWT 토큰 생성 -> 직원 정보를 암호화
            String token = Jwts.builder().setClaims(payload).signWith(SignatureAlgorithm.HS256,secretKey.getBytes()).compact();

            //QR코드 생성 -> JWT 토큰을 QR 코드로 변환
            ByteArrayOutputStream stream = QRCode.from(token).withSize(250,250).stream();

            return stream.toByteArray(); //Byte 배열로 반환
        } catch (Exception e) {
            throw new RuntimeException("QR코드 생성 실패 ",e);
        }
    }

//    public UserQRData verifyQRcode(String token){
//        try{
//            Claims claims = Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token).getBody();
//
//            Integer userId = claims.get("userId",Integer.class);
//            Long timeStamp = claims.get("timeStamp",Long.class);
//
//            if(isExpired(timeStamp)){
//
//            }
//        }
//    }
}
