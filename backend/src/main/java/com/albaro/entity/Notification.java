package com.albaro.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {

    // notification PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT UNSIGNED")
    private Integer notificationId;

    // 공지 제목
    @Column(nullable = false, length = 100)
    private String notificationTitle;

    // 공지 내용
    @Column(nullable = false, columnDefinition = "TEXT")
    private String notificationContent;

    // 공지 생성 시간 (기본값 현재 시간)
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdTime = LocalDateTime.now();

    // store 테이블의 storeId를 1:N 관계 외래키 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="storeId", foreignKey = @ForeignKey(name = "FK_notification_store"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonBackReference
    private Store store;

    public Integer getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public String getNotificationTitle() {
        return notificationTitle;
    }

    public void setNotificationTitle(String notificationTitle) {
        this.notificationTitle = notificationTitle;
    }

    public String getNotificationContent() {
        return notificationContent;
    }

    public void setNotificationContent(String notificationContent) {
        this.notificationContent = notificationContent;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }
}
