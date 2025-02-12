package com.albaro.controller;

import com.albaro.dto.WorkInformationResponse;
import com.albaro.service.WorkInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/work-information")
public class WorkInformationController {

    @Autowired
    private WorkInformationService workInformationService;

    // 특정 스토어의 모든 근무 정보 조회
    @GetMapping("/{storeId}")
    public List<WorkInformationResponse> getWorkInformationsByStoreId(@PathVariable Integer storeId) {
        return workInformationService.getWorkInformationByStoreId(storeId);
    }
}
