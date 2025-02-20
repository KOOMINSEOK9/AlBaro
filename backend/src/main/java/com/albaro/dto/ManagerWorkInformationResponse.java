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

    // userId 조회를 위한 필드 추가
    private Integer userId; // 사용자 ID

    public ManagerWorkInformationResponse(WorkInformation workInformation, UserRepository userRepository) {
        this.workDate = workInformation.getWorkDate();
        this.startTime = workInformation.getStartTime();
        this.endTime = workInformation.getEndTime();
        this.isVacant = workInformation.getVacant();
        this.userId = workInformation.getUser().getUserId();
        this.userName = workInformation.getUser().getUserName();
        this.storeName = workInformation.getStore().getStoreName();

        if (workInformation.getRealTimeWorker() != null) {
            // 🔹 기존: userId 기준으로 검색
            // 🔹 변경: realTimeWorker(AccountId)와 동일한 AccountId를 가진 사용자의 userName 반환
            Optional<User> realTimeWorkerUser = userRepository.findAll().stream()
                    .filter(user -> user.getAccountId() != null && user.getAccountId().equals(workInformation.getRealTimeWorker()))
                    .findFirst();

            this.realTimeWorkerName = realTimeWorkerUser.map(User::getUserName).orElse("N/A");
        } else {
            this.realTimeWorkerName = "N/A";
        }
    }

    // userId로 직접 조회하는 생성자 추가 (userId → userName, storeName 반환)
    public ManagerWorkInformationResponse(Integer userId, String userName, String storeName) {
        this.userId = userId;
        this.userName = userName;
        this.storeName = storeName;
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

    public Integer getUserId() {
        return userId;
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
