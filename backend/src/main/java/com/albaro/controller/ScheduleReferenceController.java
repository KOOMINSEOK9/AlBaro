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

    // ✅ 모든 일정 조회 (GET /api/schedule-references)
    @GetMapping
    public ResponseEntity<List<ScheduleReferenceResponse>> getAllScheduleReferences() {
        return ResponseEntity.ok(scheduleReferenceService.getAllScheduleReferences());
    }

    // ✅ 특정 일정 조회 (GET /api/schedule-references/{scheduleReferenceId})
    @GetMapping("/{scheduleReferenceId}")
    public ResponseEntity<ScheduleReferenceResponse> getScheduleReferenceById(@PathVariable Integer scheduleReferenceId) {
        return ResponseEntity.ok(scheduleReferenceService.getScheduleReferenceById(scheduleReferenceId));
    }

    // ✅ 일정 추가 (POST /api/schedule-references)
    @PostMapping
    public ResponseEntity<ScheduleReferenceResponse> createScheduleReference(@RequestBody ScheduleReferenceRequest scheduleRequest) {
        return ResponseEntity.ok(scheduleReferenceService.createScheduleReference(scheduleRequest));
    }

    // ✅ 일정 수정 (PUT /api/schedule-references/{scheduleReferenceId})
    @PutMapping("/{scheduleReferenceId}")  // 📌 **추가된 부분**
    public ResponseEntity<ScheduleReferenceResponse> updateScheduleReference(
            @PathVariable Integer scheduleReferenceId,
            @RequestBody ScheduleReferenceRequest scheduleRequest) {
        return ResponseEntity.ok(scheduleReferenceService.updateScheduleReference(scheduleReferenceId, scheduleRequest));
    }

    // ✅ 일정 삭제 (DELETE /api/schedule-references/{scheduleReferenceId})
    @DeleteMapping("/{scheduleReferenceId}")
    public ResponseEntity<Void> deleteScheduleReference(@PathVariable Integer scheduleReferenceId) {
        scheduleReferenceService.deleteScheduleReference(scheduleReferenceId);
        return ResponseEntity.noContent().build();
    }
}
