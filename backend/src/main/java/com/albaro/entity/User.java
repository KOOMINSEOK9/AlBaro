// User.java
package com.albaro.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Table(name = "user")
public class User {

    // 사용자 고유 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( name = "userId", columnDefinition = "INT UNSIGNED")
    private Integer userId;

    // 사용자 - 상점 관계 -> 다 대 1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storeId", nullable = false, foreignKey = @ForeignKey(name = "FK_user_store"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Store store;

//    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<Manual> manuals;

    // 직책
    @Column(name = "role", nullable = false, length = 7)
    private String role;  // ENUM('manager', 'staff')

    // 사번
    @Column(name = "accountId", unique= true)
    private Integer accountId;

    // 비밀번호
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    // 이름
    @Column(name = "userName", nullable = false, length = 20)
    private String userName;

    // 휴대폰 번호
    @Column(name = "phoneNumber", nullable = false, length = 13)
    private String phoneNumber;

    // 이메일
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    // 우편번호
    @Column(name = "zipCode", length = 15)
    private String zipCode;

    // 도로명 주소
    @Column(name = "roadAddress", length = 255)
    private String roadAddress;

    // 상세 주소
    @Column(name = "detailedAddress", length = 255)
    private String detailedAddress;

    // 사업자 번호
    @Column(name = "businessNumber",length = 12)
    private String businessNumber;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alarm> alarms;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private UserProfileImage userProfileImage;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getRoadAddress() {
        return roadAddress;
    }

    public void setRoadAddress(String roadAddress) {
        this.roadAddress = roadAddress;
    }

    public String getDetailedAddress() {
        return detailedAddress;
    }

    public void setDetailedAddress(String detailedAddress) {
        this.detailedAddress = detailedAddress;
    }

    public String getBusinessNumber() {
        return businessNumber;
    }

    public void setBusinessNumber(String businessNumber) {
        this.businessNumber = businessNumber;
    }

    public List<Alarm> getAlarms() {
        return alarms;
    }

    public void setAlarms(List<Alarm> alarms) {
        this.alarms = alarms;
    }

    public UserProfileImage getUserProfileImage() {
        return userProfileImage;
    }

    public void setUserProfileImage(UserProfileImage userProfileImage) {
        this.userProfileImage = userProfileImage;
    }
}

