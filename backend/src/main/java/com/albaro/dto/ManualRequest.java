package com.albaro.dto;

import com.albaro.entity.Manual;
import com.albaro.entity.Store;
import java.time.LocalDateTime;

public class ManualRequest {
    private String manualName;
    private String category;
    private Integer storeId;

    public ManualRequest() {}

    public ManualRequest(String manualName, String category, Integer storeId) {
        this.manualName = manualName;
        this.category = category;
        this.storeId = storeId;
    }

    //  DTO -> 엔티티 변환 (Store 객체를 사용)
    public Manual toEntity(Store store) {
        return new Manual(null, store, category, manualName, LocalDateTime.now());
    }

    public String getManualName() { return manualName; }
    public String getCategory() { return category; }
    public Integer getStoreId() { return storeId; }
}
