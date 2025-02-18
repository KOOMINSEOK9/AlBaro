package com.albaro.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "manual")
public class Manual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manualId", columnDefinition = "INT UNSIGNED")
    private Integer manualId;

    @ManyToOne(fetch = FetchType.LAZY)  //  Store 엔티티와 관계 설정
    @JoinColumn(name = "storeId", nullable = false, foreignKey = @ForeignKey(name = "FK_manual_store"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Store store;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    @Column(name = "manualName", nullable = false, length = 300)
    private String manualName;

    @Column(name = "createdTime", nullable = false)
    private LocalDateTime createdTime;

    public Manual() {}

    public Manual(Integer manualId, Store store, String category, String manualName, LocalDateTime createdTime) {
        this.manualId = manualId;
        this.store = store;
        this.category = category;
        this.manualName = manualName;
        this.createdTime = createdTime;
    }

    public Integer getManualId() {
        return manualId;
    }

    public void setManualId(Integer manualId) {
        this.manualId = manualId;
    }

    public Store getStore() { return store; }  //  Store 엔티티 반환
    public void setStore(Store store) { this.store = store; }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getManualName() {
        return manualName;
    }

    public void setManualName(String manualName) {
        this.manualName = manualName;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}
