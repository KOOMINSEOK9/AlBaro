package com.albaro.QRcode;

//QR에서 추출한 사용자(알바생) 정보
public class UserQRData {
    private final Integer userId; //직원 id
    private final Long timeStamp; //QR 생성 시간(?)

    public UserQRData(Integer userId, Long timeStamp) {
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    public Integer getUserId() {
        return userId;
    }

    public Long getTimeStamp() {
        return timeStamp;
    }
}
