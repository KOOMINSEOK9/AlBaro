package com.albaro.dto;

import com.albaro.entity.WorkInformation;
import com.albaro.entity.User;
import com.albaro.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public class ManagerWorkInformationResponse {

    private LocalDate workDate;  // 근무 날짜
    private LocalTime startTime; // 근무 시작 시간
    private LocalTime endTime;   // 근무 종료 시간
    private boolean isVacant;    // 공석 여부
    private String userName;     // 근무자 이름
    private String storeName;    // 점포 이름
    private String realTimeWorkerName; // 실제 대타 근무자 이름

    public ManagerWorkInformationResponse(WorkInformation workInformation, UserRepository userRepository) {
        this.workDate = workInformation.getWorkDate();
        this.startTime = workInformation.getStartTime();
        this.endTime = workInformation.getEndTime();
        this.isVacant = workInformation.getVacant();
        this.userName = workInformation.getUser().getUserName();
        this.storeName = workInformation.getStore().getStoreName();

        if (workInformation.getRealTimeWorker() != null) {
            Optional<User> realTimeWorkerUser = userRepository.findById(workInformation.getRealTimeWorker());
            this.realTimeWorkerName = realTimeWorkerUser.map(User::getUserName).orElse("N/A");
        } else {
            this.realTimeWorkerName = "N/A";
        }

    }

    // Getter 메서드 추가
    public LocalDate getWorkDate() {
        return workDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public boolean isVacant() {
        return isVacant;
    }

    public String getUserName() {
        return userName;
    }

    public String getStoreName() {
        return storeName;
    }

    public String getRealTimeWorkerName() {
        return realTimeWorkerName;
    }
}