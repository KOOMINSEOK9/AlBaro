package com.albaro.dto;

import com.albaro.entity.Manual;
import java.time.LocalDateTime;

public class ManualResponse {
    private Integer manualId;
    private Integer storeId;
    private String category;
    private String manualName;
    private LocalDateTime createdTime;

    public ManualResponse() {}

    public ManualResponse(Manual manual) {
        this.manualId = manual.getManualId();
        this.storeId = manual.getStore().getStoreId();  //  Store 엔티티에서 storeId 가져오기
        this.category = manual.getCategory();
        this.manualName = manual.getManualName();
        this.createdTime = manual.getCreatedTime();
    }

    public Integer getManualId() { return manualId; }
    public Integer getStoreId() { return storeId; }
    public String getCategory() { return category; }
    public String getManualName() { return manualName; }
    public LocalDateTime getCreatedTime() { return createdTime; }
}
