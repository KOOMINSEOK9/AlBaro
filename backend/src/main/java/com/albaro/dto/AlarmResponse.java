package com.albaro.dto;

import java.time.LocalDateTime;

public class AlarmResponse {
    private Integer alarmId;
    private String alarmContent;
    private String alarmType;
    private LocalDateTime sentTime;
    private Integer senderId;
    private String alarmStatus;
    private String userName;
    private Integer accountId;
    private Integer userId;

    public AlarmResponse(Integer alarmId, String alarmContent, String alarmType, LocalDateTime sentTime, Integer senderId, String alarmStatus, String userName, Integer accountId, Integer userId) {
        this.alarmId = alarmId;
        this.alarmContent = alarmContent;
        this.alarmType = alarmType;
        this.sentTime = sentTime;
        this.senderId = senderId;
        this.alarmStatus = alarmStatus;
        this.userName = userName;
        this.accountId = accountId;
        this.userId = userId;
    }

    public Integer getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(Integer alarmId) {
        this.alarmId = alarmId;
    }

    public String getAlarmContent() {
        return alarmContent;
    }

    public void setAlarmContent(String alarmContent) {
        this.alarmContent = alarmContent;
    }

    public String getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(String alarmType) {
        this.alarmType = alarmType;
    }

    public LocalDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(LocalDateTime sentTime) {
        this.sentTime = sentTime;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public String getAlarmStatus() {
        return alarmStatus;
    }

    public void setAlarmStatus(String alarmStatus) {
        this.alarmStatus = alarmStatus;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
