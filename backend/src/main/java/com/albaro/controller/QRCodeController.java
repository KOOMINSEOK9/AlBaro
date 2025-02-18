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

@RestController
@RequestMapping("api/qr")
public class QRCodeController {
    private final QRCodeService qrCodeService;

    public QRCodeController(QRCodeService qrCodeService){
        this.qrCodeService = qrCodeService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQR(@AuthenticationPrincipal User user){

        //로그인 한 직원 아이디로 QR 코드 생성
        byte[] qrCode = qrCodeService.generateUserQR(user.getUserId());

        if(qrCode == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrCode);
    }


    //QR코드 검증
    @PostMapping("/verify")
    public ResponseEntity<AttendanceResponse> verifyQR(
            @RequestBody QRVerificationRequest request,
            @AuthenticationPrincipal User manager) {
        try {
            // 디버깅
            System.out.println("Received token: " + request.getToken());
            System.out.println("Manager storeId: " + manager.getStore().getStoreId());

            //1. QR 코드 검증
            UserQRData data = qrCodeService.verifyQRcode(request.getToken());
            System.out.println("Verified data: " + data);

            //2. 검증 후 출석정보 업데이트
            qrCodeService.updateWorkInformation(data.getUserId(),manager.getStore().getStoreId());

            return ResponseEntity.ok(new AttendanceResponse(true));
        } catch (Exception e) {
            // 구체적인 에러 메시지 포함
            System.out.println("Verification failed: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new AttendanceResponse(false, e.getMessage()));
        }
    }


}
