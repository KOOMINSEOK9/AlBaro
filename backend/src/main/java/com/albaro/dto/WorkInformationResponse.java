package com.albaro.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class WorkInformationResponse {
    private Integer scheduleId;
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isVacant;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Integer realTimeWorker;
    private String userName;
    private Integer accountId;
    private Integer userId;

    public WorkInformationResponse(Integer scheduleId, LocalDate workDate, LocalTime startTime, LocalTime endTime, Boolean isVacant, LocalTime checkInTime, LocalTime checkOutTime, Integer realTimeWorker, String userName, Integer accountId, Integer userId) {
        this.scheduleId = scheduleId;
        this.workDate = workDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isVacant = isVacant;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.realTimeWorker = realTimeWorker;
        this.userName = userName;
        this.accountId = accountId;
        this.userId = userId;
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
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
