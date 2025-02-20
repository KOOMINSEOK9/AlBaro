package com.albaro.controller;

import com.albaro.QRcode.AttendanceResponse;
import com.albaro.QRcode.QRVerificationRequest;
import com.albaro.QRcode.UserQRData;
import com.albaro.entity.User;
import com.albaro.service.QRCodeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("api/qr")
public class QRCodeController {
    private final QRCodeService qrCodeService;

    public QRCodeController(QRCodeService qrCodeService){
        this.qrCodeService = qrCodeService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQR(@RequestBody User user){

        //로그인 한 직원 아이디로 QR 코드 생성
        byte[] qrCode = qrCodeService.generateUserQR(user.getUserId());

        if(qrCode == null){
            return ResponseEntity.notFound().build();
        }
// Base64로 변환
        String base64QrCode = Base64.getEncoder().encodeToString(qrCode);

        // JSON 형태로 반환
        return ResponseEntity.ok().body(Map.of("qrCode", base64QrCode));    }


    //QR코드 검증
    @PostMapping("/verify")
    public ResponseEntity<?> verifyQR(
            @RequestBody QRVerificationRequest request) {
        try {
            // 디버깅
            System.out.println("Received token: " + request.getToken());
            System.out.println("Manager storeId: " + request.getStoreId());

            //1. QR 코드 검증
            UserQRData data = qrCodeService.verifyQRcode(request.getToken());
            System.out.println("Verified data: " + data);

            //2. 검증 후 출석정보 업데이트
            qrCodeService.updateWorkInformation(data.getUserId(),request.getStoreId());

            return ResponseEntity.ok().body("qr 본인 인증 성공");
        } catch (Exception e) {
            // 구체적인 에러 메시지 포함
            System.out.println("Verification failed: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("qr 본인 인증 실패" + e.getMessage());
        }
    }


}
