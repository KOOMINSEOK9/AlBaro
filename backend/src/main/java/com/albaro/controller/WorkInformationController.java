package com.albaro.controller;

import com.albaro.dto.WorkInformationResponse;
import com.albaro.service.WorkInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-information")

public class WorkInformationController {

    @Autowired
    private WorkInformationService workInformationService;

    // 특정 스토어의 모든 근무 정보 조회
    @GetMapping("/{storeId}")
    public List<WorkInformationResponse> getWorkInformationsByStoreId(@PathVariable Integer storeId) {
        System.out.println(storeId);

        return workInformationService.getWorkInformationByStoreId(storeId);
    }

    // 스케줄 삭제
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer scheduleId) {
        workInformationService.deleteSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }

    // 공석 처리
    @PatchMapping("/{scheduleId}/vacant")
    public ResponseEntity<Void> markAsVacant(@PathVariable Integer scheduleId) {
        workInformationService.markAsVacant(scheduleId);
        return ResponseEntity.noContent().build();
    }

    // 대타 요청 수락시 수락자 근무 내용 변경
    @PatchMapping("/{scheduleId}/accept-substitute/{workerId}")
    public ResponseEntity<Void> acceptSubstitute(
            @PathVariable Integer scheduleId,
            @PathVariable Integer workerId) {

        workInformationService.acceptSubstitute(scheduleId, workerId);
        return ResponseEntity.noContent().build();
    }

}
