package com.albaro.QRcode;

//QR에서 추출한 사용자(알바생) 정보
public class UserQRData {
    private final Integer userId; //직원 id
    private final Long timestamp; //QR 생성 시간(?)

    public UserQRData(Integer userId, Long timestamp) {
        this.userId = userId;
        this.timestamp = timestamp;
    }

    public Integer getUserId() {
        return userId;
    }

    public Long getTimestamp() {
        return timestamp;
    }
}
