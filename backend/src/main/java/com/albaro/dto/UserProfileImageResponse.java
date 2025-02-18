package com.albaro.dto;

import com.albaro.entity.UserProfileImage;

public class UserProfileImageResponse {

    private String userName;
    private String filePath;

    public UserProfileImageResponse(String userName, String filePath) {
        this.userName = userName;
        this.filePath = filePath;
    }

    public static UserProfileImageResponse fromEntity(UserProfileImage userProfileImage) {
        return new UserProfileImageResponse(
                userProfileImage.getUser().getUserName(),
                userProfileImage.getFilePath()
        );
    }

    public String getUserName() {
        return userName;
    }

    public String getFilePath() {
        return filePath;
    }
}
