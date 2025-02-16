package com.albaro.dto;

import com.albaro.entity.WorkInformation;
import com.albaro.entity.User;
import com.albaro.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public class UserWorkInformationResponse {
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
    private String realTimeWorkerName;
    private String storeName; // 가게 이름 추가

    public UserWorkInformationResponse(WorkInformation workInformation, UserRepository userRepository) {
        this.scheduleId = workInformation.getScheduleId();
        this.workDate = workInformation.getWorkDate();
        this.startTime = workInformation.getStartTime();
        this.endTime = workInformation.getEndTime();
        this.isVacant = workInformation.getVacant();
        this.checkInTime = workInformation.getCheckInTime();
        this.checkOutTime = workInformation.getCheckOutTime();
        this.realTimeWorker = workInformation.getRealTimeWorker();
        this.userName = workInformation.getUser().getUserName();
        this.accountId = workInformation.getUser().getAccountId();
        this.userId = workInformation.getUser().getUserId();
        this.storeName = workInformation.getStore().getStoreName(); // storeName 값 설정

        // realTimeWorker -> UserRepository에서 userName 조회
        if (workInformation.getRealTimeWorker() != null) {
            Optional<User> realTimeWorkerUser = userRepository.findById(workInformation.getRealTimeWorker());
            this.realTimeWorkerName = realTimeWorkerUser.map(User::getUserName).orElse("N/A");
        } else {
            this.realTimeWorkerName = "N/A";
        }
    }

    // userId로 직접 조회하는 생성자 추가 (userId → userName, storeName 반환)
    public UserWorkInformationResponse(Integer userId, String userName, String storeName) {
        this.userId = userId;
        this.userName = userName;
        this.storeName = storeName;
    }

    public Integer getScheduleId() { return scheduleId; }
    public LocalDate getWorkDate() { return workDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public Boolean getVacant() { return isVacant; }
    public LocalTime getCheckInTime() { return checkInTime; }
    public LocalTime getCheckOutTime() { return checkOutTime; }
    public Integer getRealTimeWorker() { return realTimeWorker; }
    public String getUserName() { return userName; }
    public Integer getAccountId() { return accountId; }
    public Integer getUserId() { return userId; }
    public String getRealTimeWorkerName() { return realTimeWorkerName; }
    public String getStoreName() { return storeName; }
}
