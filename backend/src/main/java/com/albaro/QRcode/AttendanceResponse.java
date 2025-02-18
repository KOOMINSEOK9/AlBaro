package com.albaro.QRcode;

//QR코드 검증 결과
public class AttendanceResponse {
    private final boolean success;
    private final String message;  // 실패 이유를 담을 필드

    public AttendanceResponse(boolean success) {
        this.success = success;
        this.message = null;
    }

    public AttendanceResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}