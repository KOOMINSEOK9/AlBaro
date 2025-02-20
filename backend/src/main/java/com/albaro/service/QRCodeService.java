package com.albaro.service;

import com.albaro.QRcode.UserQRData;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import net.glxn.qrgen.javase.QRCode;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.security.Key;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {
    // Keys.secretKeyFor()를 사용하여 안전한 키 생성
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final WorkInformationRepository workInformationRepository;
    private final UserRepository userRepository;

    public QRCodeService(WorkInformationRepository workInformationRepository, UserRepository userRepository){
        this.workInformationRepository = workInformationRepository;
        this.userRepository = userRepository;
    }

    //QR 생성 메서드
    public byte[] generateUserQR(Integer userId){


        try{
            Instant now = Instant.now();

            //직원 정보를 포함한 데이터(Map) 생성
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", userId);
            payload.put("timestamp", Instant.now().getEpochSecond());

            //JWT 토큰 생성 -> 직원 정보를 암호화
//            String token = Jwts.builder().setClaims(payload).signWith(SignatureAlgorithm.HS256,secretKey.getBytes()).compact();
            String token = Jwts.builder().setClaims(payload)
                    .setIssuedAt(Date.from(now))
                    .setExpiration(Date.from(now.plus(12, ChronoUnit.HOURS))) .signWith(key).compact();

            // 디버깅용
            System.out.println("Generated token payload: " + payload);

            //QR코드 생성 -> JWT 토큰을 QR 코드로 변환
            ByteArrayOutputStream stream = QRCode.from(token).withSize(250,250).stream();

            return stream.toByteArray(); //Byte 배열로 반환
        } catch (Exception e) {
            throw new RuntimeException("QR코드 생성 실패 ",e);
        }
    }

    public UserQRData verifyQRcode(String token){
        try{
//            Claims claims = Jwts.parser()
//                    .setSigningKey(secretKey.getBytes())
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();

            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Integer userId = claims.get("userId",Integer.class);
            Long timestamp = claims.get("timestamp",Long.class); //시간

            if(isExpired(timestamp)){
                throw new RuntimeException("만료된 QR코드");
            }

            return new UserQRData(userId,timestamp);
        }catch (Exception e){
            throw new RuntimeException("QR코드 검증 실패",e);
        }
    }

    //출석정보 업데이트
    public void updateWorkInformation(Integer userId, Integer storeId){

            LocalDate today = LocalDate.now();
            LocalTime currentTime = LocalTime.now();

//        System.out.println("여기 지나갔나요?");

            //디버깅
            System.out.println("Updating attendance for userId: " + userId + ", storeId: " + storeId);
            System.out.println("Current time: " + currentTime);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("no user 해당하는 사용자가 없습니다."));
            Integer accountId = user.getAccountId(); //사원 번호

            WorkInformation workInfo = workInformationRepository.findWorkInformation(accountId, today, storeId)
                    .orElseThrow(() -> new RuntimeException("no work info 해당 직원의 근무 정보가 없습니다."));

        System.out.println("Found work info: " + workInfo);
            // 출근/퇴근 여부 확인
            if (workInfo.getCheckInTime() == null) {
                // 출근 처리
                System.out.println("Updating check-in time...");
                workInformationRepository.updateCheckInTime(accountId, today, storeId, currentTime);
            } else if(workInfo.getCheckOutTime() == null){
                // 퇴근 처리
                System.out.println("Updating check-out time...");
                workInformationRepository.updateCheckOutTime(accountId, today, storeId, currentTime);
            } else if(workInfo.getCheckOutTime() != null){
                System.out.println("출/퇴근 기록이 이미 존재합니다.");
                throw new RuntimeException("출/퇴근 기록이 이미 존재합니다.");
            }

    }

    //QR 코드 만료 여부 확인(1분 제한)
    private boolean isExpired(Long timestamp){
        long currentTime = Instant.now().getEpochSecond();
        return currentTime - timestamp > 43200;
    }
}
