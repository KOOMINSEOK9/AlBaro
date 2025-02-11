package com.albaro.dto;

import com.albaro.entity.Manual;
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

    // DTO -> 엔티티 변환
    public Manual toEntity() {
        return new Manual(null, storeId, category, manualName, LocalDateTime.now());
    }

    public String getManualName() {
        return manualName;
    }

    public String getCategory() {
        return category;
    }

    public Integer getStoreId() {
        return storeId;
    }
}
