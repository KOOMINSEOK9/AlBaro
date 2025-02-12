package com.albaro.dto;

import com.albaro.entity.Store;

import java.math.BigDecimal;

public class StoreDto {

    private Integer storeId;
    private String storeName;
    private String franchiseName;
    private String zipCode;
    private String roadAddress;
    private String detailedAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public StoreDto(){

    }

    public StoreDto(Integer storeId, String storeName, String franchiseName, String zipCode, String roadAddress, String detailedAddress, BigDecimal latitude, BigDecimal longitude) {
        this.storeId = storeId;
        this.storeName = storeName;
        this.franchiseName = franchiseName;
        this.zipCode = zipCode;
        this.roadAddress = roadAddress;
        this.detailedAddress = detailedAddress;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Entity -> DTO 변환
    public static StoreDto fromEntity(Store store) {
        StoreDto dto = new StoreDto();
        dto.setStoreId(store.getStoreId());
        dto.setStoreName(store.getStoreName());
        dto.setFranchiseName(store.getFranchiseName());
        dto.setZipCode(store.getZipCode());
        dto.setRoadAddress(store.getRoadAddress());
        dto.setDetailedAddress(store.getDetailedAddress());
        dto.setLatitude(store.getLatitude());
        dto.setLongitude(store.getLongitude());
        return dto;
    }

    //Getter, Setter
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


}
