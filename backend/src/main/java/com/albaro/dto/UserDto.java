package com.albaro.dto;

import com.albaro.entity.User;

import java.time.LocalDate;
import java.time.LocalTime;

public class UserDto {
        private Integer userId;
        private String userName;
        private String role;
        private String phoneNumber;
        private LocalDate scheduleDate;
        private LocalTime scheduleStartTime ;
        private LocalTime scheduleEndTime ;
        private String filePath;

        public static com.albaro.dto.UserDto fromEntity(User user) {
            return new com.albaro.dto.UserDto(
                    user.getUserId(),
                    user.getUserName(),
                    user.getRole(),
                    user.getPhoneNumber()
            );
        }

    // 이미지 포함된 fromEntity
    public static UserDto fromEntityWithImage(User user, LocalDate scheduleDate,
                                              LocalTime scheduleStartTime, LocalTime scheduleEndTime) {
        String filePath = null;
        if (user.getUserProfileImage() != null) {
            filePath = user.getUserProfileImage().getFilePath();
        }



        return new UserDto(
                user.getUserId(),
                user.getUserName(),
                scheduleDate,
                scheduleStartTime,
                scheduleEndTime,
                filePath
        );
    }

    // 새로운 생성자 추가
    public UserDto(Integer userId, String userName) {
        this.userId = userId;
        this.userName = userName;
    }

    public UserDto(){

    }

    public UserDto(Integer userId, String userName, String role, String phoneNumber) {
        this.userId = userId;
        this.userName = userName;
        this.role = role;
        this.phoneNumber = phoneNumber;
    }

    //점장 -> 알바생 로직에 사용
    public UserDto(Integer userId, String userName, LocalDate scheduleDate,
                   LocalTime scheduleStartTime, LocalTime scheduleEndTime) {
        this.userId = userId;
        this.userName = userName;
        this.scheduleDate = scheduleDate;
        this.scheduleStartTime = scheduleStartTime;
        this.scheduleEndTime = scheduleEndTime;
    }

    //프로필 이미지 넣은 dto, 알바생 찾는 로직(점장 공석채우기, 알바생 대타 구하기)에 사용
    public UserDto(Integer userId, String userName, LocalDate scheduleDate,
                   LocalTime scheduleStartTime, LocalTime scheduleEndTime, String filePath) {
        this.userId = userId;
        this.userName = userName;
        this.scheduleDate = scheduleDate;
        this.scheduleStartTime = scheduleStartTime;
        this.scheduleEndTime = scheduleEndTime;
        this.filePath = filePath;
    }


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public LocalTime getScheduleStartTime() {
        return scheduleStartTime;
    }

    public void setScheduleStartTime(LocalTime scheduleStartTime) {
        this.scheduleStartTime = scheduleStartTime;
    }

    public LocalTime getScheduleEndTime() {
        return scheduleEndTime;
    }

    public void setScheduleEndTime(LocalTime scheduleEndTime) {
        this.scheduleEndTime = scheduleEndTime;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}