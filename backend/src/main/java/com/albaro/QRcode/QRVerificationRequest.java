package com.albaro.QRcode;

//QR 코드 검증 요청 데이터
public class QRVerificationRequest {
    private String token;

    public QRVerificationRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
