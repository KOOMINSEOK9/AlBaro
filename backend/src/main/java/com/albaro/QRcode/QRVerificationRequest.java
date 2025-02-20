package com.albaro.QRcode;

//QR 코드 검증 요청 데이터
public class QRVerificationRequest {
    private String token;
    private Integer storeId;

    public QRVerificationRequest(String token, Integer storeId) {
        this.token = token;
        this.storeId = storeId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getStoreId() { return storeId; }

    public void setStoreId() { this.storeId = storeId; }
}
