package com.albaro.dto;

import com.albaro.entity.ScheduleReference;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleReferenceResponse {
    private Integer scheduleReferenceId;
    private Integer userId;
    private Integer storeId;
    private LocalDate scheduleDate;
    private LocalTime scheduleStartTime;
    private LocalTime scheduleEndTime;

    public ScheduleReferenceResponse() {}

    public ScheduleReferenceResponse(ScheduleReference scheduleReference) {
        this.scheduleReferenceId = scheduleReference.getScheduleReferenceId();
        this.userId = scheduleReference.getUser().getUserId();
        this.storeId = scheduleReference.getStore().getStoreId();
        this.scheduleDate = scheduleReference.getScheduleDate();
        this.scheduleStartTime = scheduleReference.getScheduleStartTime();
        this.scheduleEndTime = scheduleReference.getScheduleEndTime();
    }

    public Integer getScheduleReferenceId() {
        return scheduleReferenceId;
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
