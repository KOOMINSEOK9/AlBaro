package com.albaro.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "alarm")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarmId", columnDefinition = "INT UNSIGNED")
    private Integer alarmId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId",foreignKey = @ForeignKey(name = "FK_alarm_user"))
    @JsonIgnore
    private User user;

    @Column(name = "alarmContent", length = 200)
    private String alarmContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "alarmType")
    private AlarmType alarmType;

    public enum AlarmType {
        SUBSTITUTION_REQUEST,   // 대타 요청
        SCHEDULE_UPDATE,        // 스케줄 변경(점장)
        MANAGER_APPROVAL,        // 점장 승인
        SUBSTITUTION_APPROVAL,  // 대타 승인 알림
        SUBSTITUTION_REJECT     // 대타 거절 알림
    }

    @Column(name = "sentTime")
    private LocalDateTime sentTime;

    @Column(name = "senderId", columnDefinition = "INT UNSIGNED")
    private Integer senderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "alarmStatus")
    private AlarmStatus alarmStatus;

    public enum AlarmStatus {
       WAIT, APPROVE, REJECT
    }

    public Alarm(){

    }

    public Alarm(Integer alarmId, User user, String alarmContent, AlarmType alarmType, LocalDateTime sentTime, Integer senderId, AlarmStatus alarmStatus) {
        this.alarmId = alarmId;
        this.user = user;
        this.alarmContent = alarmContent;
        this.alarmType = alarmType;
        this.sentTime = sentTime;
        this.senderId = senderId;
        this.alarmStatus = alarmStatus;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(Integer alarmId) {
        this.alarmId = alarmId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAlarmContent() {
        return alarmContent;
    }

    public void setAlarmContent(String alarmContent) {
        this.alarmContent = alarmContent;
    }

    public AlarmType getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(AlarmType alarmType) {
        this.alarmType = alarmType;
    }

    public LocalDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(LocalDateTime sentTime) {
        this.sentTime = sentTime;
    }

    public AlarmStatus getAlarmStatus() {
        return alarmStatus;
    }

    public void setAlarmStatus(AlarmStatus alarmStatus) {
        this.alarmStatus = alarmStatus;
    }
}

