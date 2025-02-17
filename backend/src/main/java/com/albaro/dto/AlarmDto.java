package com.albaro.dto;

import com.albaro.entity.Alarm;

import java.time.LocalDateTime;

public class AlarmDto {
    private Integer alarmId;
    private Integer userId;
    private String alarmContent;
    private Alarm.AlarmType alarmType;
    private LocalDateTime sentTime;

    public AlarmDto(Integer alarmId, Integer userId, String alarmContent, Alarm.AlarmType alarmType, LocalDateTime sentTime) {
        this.alarmId = alarmId;
        this.userId = userId;
        this.alarmContent = alarmContent;
        this.alarmType = alarmType;
        this.sentTime = sentTime;
    }

    public Integer getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(Integer alarmId) {
        this.alarmId = alarmId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getAlarmContent() {
        return alarmContent;
    }

    public void setAlarmContent(String alarmContent) {
        this.alarmContent = alarmContent;
    }

    public Alarm.AlarmType getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(Alarm.AlarmType alarmType) {
        this.alarmType = alarmType;
    }

    public LocalDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(LocalDateTime sentTime) {
        this.sentTime = sentTime;
    }
}
