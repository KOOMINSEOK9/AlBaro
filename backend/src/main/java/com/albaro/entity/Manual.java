package com.albaro.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "manual")
public class Manual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manualId", columnDefinition = "INT UNSIGNED")
    private Integer manualId;

    @Column(name = "storeId", nullable = false, columnDefinition = "INT UNSIGNED")
    private Integer storeId;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    @Column(name = "manualName", nullable = false, length = 300)
    private String manualName;

    @Column(name = "createdTime", nullable = false)
    private LocalDateTime createdTime;

    public Manual() {}

    public Manual(Integer manualId, Integer storeId, String category, String manualName, LocalDateTime createdTime) {
        this.manualId = manualId;
        this.storeId = storeId;
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

    public Integer getStoreId() {
        return storeId;
    }

    public void setStoreId(Integer storeId) {
        this.storeId = storeId;
    }

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
