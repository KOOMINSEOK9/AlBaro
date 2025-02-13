package com.albaro.controller;

import com.albaro.dto.ScheduleReferenceRequest;
import com.albaro.dto.ScheduleReferenceResponse;
import com.albaro.service.ScheduleReferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule-references")
public class ScheduleReferenceController {
    private final ScheduleReferenceService scheduleReferenceService;

    public ScheduleReferenceController(ScheduleReferenceService scheduleReferenceService) {
        this.scheduleReferenceService = scheduleReferenceService;
    }

    // 모든 일정 조회
    @GetMapping
    public ResponseEntity<List<ScheduleReferenceResponse>> getAllScheduleReferences() {
        return ResponseEntity.ok(scheduleReferenceService.getAllScheduleReferences());
    }

    // 특정 일정 조회
    @GetMapping("/{scheduleReferenceId}")
    public ResponseEntity<ScheduleReferenceResponse> getScheduleReferenceById(@PathVariable Integer scheduleReferenceId) {
        return ResponseEntity.ok(scheduleReferenceService.getScheduleReferenceById(scheduleReferenceId));
    }

    // 특정 userId의 일정 조회 (현재 연도 & 월 기준)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ScheduleReferenceResponse>> getUserScheduleForCurrentMonth(@PathVariable Integer userId) {
        return ResponseEntity.ok(scheduleReferenceService.getUserScheduleForCurrentMonth(userId));
    }

    // 일정 추가
    @PostMapping
    public ResponseEntity<ScheduleReferenceResponse> createScheduleReference(@RequestBody ScheduleReferenceRequest scheduleRequest) {
        return ResponseEntity.ok(scheduleReferenceService.createScheduleReference(scheduleRequest));
    }

    // 일정 수정
    @PutMapping("/{scheduleReferenceId}")
    public ResponseEntity<ScheduleReferenceResponse> updateScheduleReference(
            @PathVariable Integer scheduleReferenceId,
            @RequestBody ScheduleReferenceRequest scheduleRequest) {
        return ResponseEntity.ok(scheduleReferenceService.updateScheduleReference(scheduleReferenceId, scheduleRequest));
    }

    // 일정 삭제
    @DeleteMapping("/{scheduleReferenceId}")
    public ResponseEntity<Void> deleteScheduleReference(@PathVariable Integer scheduleReferenceId) {
        scheduleReferenceService.deleteScheduleReference(scheduleReferenceId);
        return ResponseEntity.noContent().build();
    }
}
