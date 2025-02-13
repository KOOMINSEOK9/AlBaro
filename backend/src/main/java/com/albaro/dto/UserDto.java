package com.albaro.dto;

import com.albaro.entity.User;

public class UserDto {
    private Integer userId;
    private String userName;
    private String role;
    private String phoneNumber;

    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getUserId(),
                user.getUserName(),
                user.getRole(),
                user.getPhoneNumber()
        );
    }

    public UserDto(){

    }

    public UserDto(Integer userId, String userName, String role, String phoneNumber) {
        this.userId = userId;
        this.userName = userName;
        this.role = role;
        this.phoneNumber = phoneNumber;
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
}