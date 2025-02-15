package com.albaro.dto;

import com.albaro.entity.Store;

import java.math.BigDecimal;
import java.util.List;

public class StoreDto {

    private Integer storeId;
    private String storeName;
    private String franchiseName;
    private String zipCode;
    private String roadAddress;
    private String detailedAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<Integer> availableWorkerIds; // 점장 -> 알바생 로직
    private List<UserDto> availableWorkers; //알바생 -> 알바생 로직

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


    // 기존 생성자는 유지하고 새로운 생성자 추가
    public StoreDto(Integer storeId, String storeName, String franchiseName,
                    String zipCode, String roadAddress, String detailedAddress,
                    BigDecimal latitude, BigDecimal longitude, List<Integer> availableWorkerIds) {
        this.storeId = storeId;
        this.storeName = storeName;
        this.franchiseName = franchiseName;
        this.zipCode = zipCode;
        this.roadAddress = roadAddress;
        this.detailedAddress = detailedAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.availableWorkerIds = availableWorkerIds;
    }


    // Entity -> DTO 변환
    public static StoreDto fromEntity(Store store, List<Integer> workerIds) {
        StoreDto dto = new StoreDto();
        dto.setStoreId(store.getStoreId());
        dto.setStoreName(store.getStoreName());
        dto.setFranchiseName(store.getFranchiseName());
        dto.setZipCode(store.getZipCode());
        dto.setRoadAddress(store.getRoadAddress());
        dto.setDetailedAddress(store.getDetailedAddress());
        dto.setLatitude(store.getLatitude());
        dto.setLongitude(store.getLongitude());
        dto.setAvailableWorkerIds(workerIds);
        return dto;
    }

    // 기존 fromEntity 메소드도 오버로딩으로 유지
    public static StoreDto fromEntity(Store store) {
        return fromEntity(store, null);
    }

    //알바생 -> 알바생 로직에 필요
    public static StoreDto fromEntity(Integer storeId, List<UserDto> workers) {
        StoreDto dto = new StoreDto();
        dto.setStoreId(storeId);
        dto.setAvailableWorkers(workers);
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

    public List<Integer> getAvailableWorkerIds() {
        return availableWorkerIds;
    }

    public void setAvailableWorkerIds(List<Integer> availableWorkerIds) {
        this.availableWorkerIds = availableWorkerIds;
    }

    public List<UserDto> getAvailableWorkers() {
        return availableWorkers;
    }

    public void setAvailableWorkers(List<UserDto> availableWorkers) {
        this.availableWorkers = availableWorkers;
    }
}
