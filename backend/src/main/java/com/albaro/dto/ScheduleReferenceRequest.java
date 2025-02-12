package com.albaro.dto;

import com.albaro.entity.ScheduleReference;
import com.albaro.entity.Store;
import com.albaro.entity.User;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleReferenceRequest {
    private Integer userId;
    private Integer storeId;
    private LocalDate scheduleDate;
    private LocalTime scheduleStartTime;
    private LocalTime scheduleEndTime;

    public ScheduleReferenceRequest() {}

    public ScheduleReferenceRequest(Integer userId, Integer storeId, LocalDate scheduleDate, LocalTime scheduleStartTime, LocalTime scheduleEndTime) {
        this.userId = userId;
        this.storeId = storeId;
        this.scheduleDate = scheduleDate;
        this.scheduleStartTime = scheduleStartTime;
        this.scheduleEndTime = scheduleEndTime;
    }


    public ScheduleReference toEntity(User user, Store store) {
        return new ScheduleReference(user, store, scheduleDate, scheduleStartTime, scheduleEndTime);
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getStoreId() {
        return storeId;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public LocalTime getScheduleStartTime() {
        return scheduleStartTime;
    }

    public LocalTime getScheduleEndTime() {
        return scheduleEndTime;
    }
}
