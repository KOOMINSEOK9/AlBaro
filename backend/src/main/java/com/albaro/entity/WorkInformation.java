// WorkInformation.java
package com.albaro.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "workInformation")
public class WorkInformation {

    // 스케줄 고유 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheduleId", columnDefinition = "INT UNSIGNED")
    private Integer scheduleId;

    // WorkInformation - store 관계 -> 다 대 1 : 여러개의 근무 정보가 하나의 지점에 연결 가능
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storeId", nullable = false, foreignKey = @ForeignKey(name = "FK_workInformation_store"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Store store;

    // 근무정보 - 사용자 관계 -> 다 대 1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false,  foreignKey = @ForeignKey(name = "FK_workInformation_user"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;// 근무자

    @Column(name = "workDate", nullable = false)
    private LocalDate workDate;    // 근무 날짜

    @Column(name = "startTime", nullable = false)
    private LocalTime startTime;    // 시작 시간

    @Column(name = "endTime", nullable = false)
    private LocalTime endTime;    // 마감 시간

    @Column(name = "isVacant", nullable = false, columnDefinition = "BIT(1) DEFAULT 0")
    private Boolean isVacant;    // 공석 여부

    @Column(name = "checkInTime")
    private LocalTime checkInTime;    // 알바생 출근 시간

    @Column(name = "checkOutTime")
    private LocalTime checkOutTime;    // 알바생 퇴근 시간

    // realTimeWorker
    // 실제 근무자 - 대타 파악 용도
    // user: 원래 근무 배정자(외래키),  realTimeWorker: 실제 근무자
    // user == realTimeWorker: 배정 받은 사람이 근무함, user != realTimeWorker: 대타 받음
    @Column(name = "realTimeWorker", columnDefinition = "INT UNSIGNED")
    private Integer realTimeWorker;    // 실제 근무자



    public WorkInformation(){

    }

    public WorkInformation(Integer scheduleId, Store store, User user, LocalDate workDate, LocalTime startTime, LocalTime endTime, Boolean isVacant, LocalTime checkInTime, LocalTime checkOutTime, Integer realTimeWorker) {
        this.scheduleId = scheduleId;
        this.store = store;
        this.user = user;
        this.workDate = workDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isVacant = isVacant;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.realTimeWorker = realTimeWorker;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getVacant() {
        return isVacant;
    }

    public void setVacant(Boolean vacant) {
        isVacant = vacant;
    }

    public LocalTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public Integer getRealTimeWorker() {
        return realTimeWorker;
    }

    public void setRealTimeWorker(Integer realTimeWorker) {
        this.realTimeWorker = realTimeWorker;
    }
}