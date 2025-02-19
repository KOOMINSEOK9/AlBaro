package com.albaro.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "userProfileImage")
public class UserProfileImage {

    // 사용자 프로필 이미지 ID (PK, Auto Increment)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userProfileImageId", columnDefinition = "INT UNSIGNED")
    private Integer userProfileImageId;

    // user 테이블과의 관계 (userId 참조)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false, foreignKey = @ForeignKey(name = "FK_userProfileImage_user"))
    private User user;

    // 프로필 이미지 경로 (S3 URL 또는 로컬 파일 경로 저장)
    @Column(name = "filePath", nullable = false, length = 255)
    private String filePath;

    // 기본 생성자
    public UserProfileImage() {
    }

    public UserProfileImage(Integer userProfileImageId, User user, String filePath) {
        this.userProfileImageId = userProfileImageId;
        this.user = user;
        this.filePath = filePath;
    }

    public Integer getUserProfileImageId() {
        return userProfileImageId;
    }

    public void setUserProfileImageId(Integer userProfileImageId) {
        this.userProfileImageId = userProfileImageId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
