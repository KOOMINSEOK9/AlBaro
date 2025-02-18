package com.albaro.controller;

import com.albaro.QRcode.QRVerificationRequest;
import com.albaro.QRcode.UserQRData;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import com.albaro.service.QRCodeService;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.Map;

@RestController
@Profile("dev")
public class QRTestController {

    private final QRCodeService qrCodeService;
    private final WorkInformationRepository workInformationRepository;
    private final UserRepository userRepository;

    public QRTestController(QRCodeService qrCodeService, WorkInformationRepository workInformationRepository, UserRepository userRepository) {
        this.qrCodeService = qrCodeService;
        this.workInformationRepository = workInformationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/test/qr/{userId}")
    public Map<String, String> testQR(@PathVariable Integer userId) {

        // QR 생성
        byte[] qrCode = qrCodeService.generateUserQR(userId);

        // QR에서 토큰 추출 (테스트용)
        String token = extractTokenFromQR(qrCode);

        return Map.of(
                "token", token,
                "userId", userId.toString()
        );
    }

    private String extractTokenFromQR(byte[] qrCode) {
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(qrCode));
            Result result = new MultiFormatReader().decode(
                    new BinaryBitmap(
                            new HybridBinarizer(
                                    new BufferedImageLuminanceSource(image)
                            )
                    )
            );
            return result.getText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

//    @PostMapping("/test/verify")
//    public ResponseEntity<?> testVerify(@RequestBody QRVerificationRequest request) {
//        try {
//            // 받은 토큰 출력
//            System.out.println("Received token: " + request.getToken());
//
//            UserQRData data = qrCodeService.verifyQRcode(request.getToken());
//            System.out.println("Verification successful: " + data);
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "userId", data.getUserId(),
//                    "timestamp", data.getTimestamp()
//            ));
//        } catch (Exception e) {
//            // 상세한 에러 정보 출력
//            System.out.println("Verification failed: " + e.getMessage());
//            e.printStackTrace();  // 스택 트레이스 출력
//
//            return ResponseEntity.badRequest().body(Map.of(
//                    "success", false,
//                    "error", e.getMessage()
//            ));
//        }
//    }
//
//    @GetMapping("/test/attendance/{userId}")
//    public ResponseEntity<?> checkAttendance(
//            @PathVariable Integer userId,
//            @RequestParam Integer storeId,
//            @RequestParam String date  // 예: "2024-02-18" 형식
//    ) {
//        try {
//            LocalDate workDate = LocalDate.parse(date);
//
//            User worker = userRepository.findById(userId)
//                    .orElseThrow(() -> new RuntimeException("해당하는 사용자가 없습니다."));
//            Integer workerAccountId = worker.getAccountId();
//
//            // 해당 날짜의 근무 정보 조회
//            WorkInformation workInfo = workInformationRepository
//                    .findWorkInformation(workerAccountId, workDate, storeId)
//                    .orElseThrow(() -> new RuntimeException("근무 정보가 없습니다."));
//
//
//
//            // 조회된 정보를 Map으로 변환하여 반환
//            return ResponseEntity.ok(Map.of(
//                    "userId", workInfo.getRealTimeWorker(),
//                    "workDate", workInfo.getWorkDate().toString(),
//                    "checkInTime", workInfo.getCheckInTime() != null ? workInfo.getCheckInTime().toString() : "없음",
//                    "checkOutTime", workInfo.getCheckOutTime() != null ? workInfo.getCheckOutTime().toString() : "없음",
//                    "storeId", workInfo.getStore().getStoreId()
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of(
//                    "error", e.getMessage()
//            ));
//        }
//    }

@PostMapping("/test/verify")
public ResponseEntity<?> testVerify(
        @RequestBody QRVerificationRequest request,
        @RequestParam Integer storeId) {  // storeId 파라미터 추가
    try {
        // 받은 토큰 출력
        System.out.println("Received token: " + request.getToken());

        // 1. QR 코드 검증
        UserQRData data = qrCodeService.verifyQRcode(request.getToken());
        System.out.println("Verification successful: " + data);

//        // 2. userId로 accountId 조회
//        User worker = userRepository.findById(data.getUserId())
//                .orElseThrow(() -> new RuntimeException("해당하는 사용자가 없습니다."));
//        Integer workerAccountId = worker.getAccountId();

        // 3. 검증 후 출근정보 업데이트
        qrCodeService.updateWorkInformation(data.getUserId(), storeId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "userId", data.getUserId(),
                "timestamp", data.getTimestamp()
        ));
    } catch (Exception e) {
        System.out.println("Verification failed: " + e.getMessage());
        e.printStackTrace();

        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
        ));
    }
}







}