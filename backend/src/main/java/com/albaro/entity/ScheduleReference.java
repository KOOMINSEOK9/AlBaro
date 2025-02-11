// ScheduleReference.java
package com.project.albaro.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "scheduleReference")
@Builder
public class ScheduleReference {

    // 희망 근무 참조 일정 고유 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheduleReferenceId", columnDefinition = "INT UNSIGNED")
    private Integer scheduleReferenceId;

    // 대타 희망자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", foreignKey = @ForeignKey(name = "FK_scheduleReference_user"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    //가게 Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storeId", foreignKey = @ForeignKey(name = "FK_scheduleReference_store"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Store store;

    // 대타 희망 날짜
    @Column(name = "scheduleDate")
    private LocalDate scheduleDate;

    // 대타 희망 시작 시간
    @Column(name = "scheduleStartTime")
    private LocalTime scheduleStartTime;

    // 대타 희망 종료 시간
    @Column(name = "scheduleEndTime")
    private LocalTime scheduleEndTime;

    public ScheduleReference(){
    }

    public ScheduleReference(Integer scheduleReferenceId, User user, Store store, LocalDate scheduleDate, LocalTime scheduleStartTime, LocalTime scheduleEndTime) {
        this.scheduleReferenceId = scheduleReferenceId;
        this.user = user;
        this.store = store;
        this.scheduleDate = scheduleDate;
        this.scheduleStartTime = scheduleStartTime;
        this.scheduleEndTime = scheduleEndTime;
    }

    public Integer getScheduleReferenceId() {
        return scheduleReferenceId;
    }

    public void setScheduleReferenceId(Integer scheduleReferenceId) {
        this.scheduleReferenceId = scheduleReferenceId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
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
}
