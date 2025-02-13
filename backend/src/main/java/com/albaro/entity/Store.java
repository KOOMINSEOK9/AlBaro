// Store.java
package com.albaro.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "store")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storeId", columnDefinition = "INT UNSIGNED")
    private Integer storeId;

    @Column(name = "storeName", nullable = false, length = 30)
    private String storeName;

    @Column(name = "franchiseName", nullable = false, length = 30)
    private String franchiseName;

    @Column(name = "zipCode",nullable = false, length = 5)
    private String zipCode;

    @Column(name = "roadAddress", nullable = false, length = 255)
    private String roadAddress;

    @Column(name = "detailedAddress", nullable = false, length = 255)
    private String detailedAddress;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    public Store(){

    }

    public Store(Integer storeId, String storeName, String franchiseName, String zipCode, String roadAddress, String detailedAddress, BigDecimal latitude, BigDecimal longitude) {
        this.storeId = storeId;
        this.storeName = storeName;
        this.franchiseName = franchiseName;
        this.zipCode = zipCode;
        this.roadAddress = roadAddress;
        this.detailedAddress = detailedAddress;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Notification> notifications;  // store_notification N:1

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Manual> manuals;


    public Integer getStoreId() {
        return storeId;
    }

    public void setStoreId(Integer storeId) {
        this.storeId = storeId;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getFranchiseName() {
        return franchiseName;
    }

    public void setFranchiseName(String franchiseName) {
        this.franchiseName = franchiseName;
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

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

//    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<Manual> manuals;
//
//    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<WorkInformation> workInformations;
//
//    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<User> users;
}
