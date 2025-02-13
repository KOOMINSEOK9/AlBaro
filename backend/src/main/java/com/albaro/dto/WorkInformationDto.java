package com.albaro.dto;

import com.albaro.entity.WorkInformation;

import java.time.LocalDate;
import java.time.LocalTime;

public class WorkInformationDto {

    private Integer scheduleId;
    private StoreDto store;
    private Integer userId;  // User 객체 대신 ID만 전달
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isVacant;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Integer realTimeWorker;

    // 기본 생성자
    public WorkInformationDto() {
    }

    // Entity -> DTO 변환 메서드
    public static WorkInformationDto fromEntity(WorkInformation entity) {
        WorkInformationDto dto = new WorkInformationDto();
        dto.setScheduleId(entity.getScheduleId());
        dto.setStore(StoreDto.fromEntity(entity.getStore()));
        dto.setUserId(entity.getUser().getUserId());  // User 엔티티에서 ID만 추출
        dto.setWorkDate(entity.getWorkDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setIsVacant(entity.getVacant());
        dto.setCheckInTime(entity.getCheckInTime());
        dto.setCheckOutTime(entity.getCheckOutTime());
        dto.setRealTimeWorker(entity.getRealTimeWorker());
        return dto;
    }

    // Getter, Setter 메서드
    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public StoreDto getStore() {
        return store;
    }

    public void setStore(StoreDto store) {
        this.store = store;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public Boolean getIsVacant() {
        return isVacant;
    }

    public void setIsVacant(Boolean vacant) {
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