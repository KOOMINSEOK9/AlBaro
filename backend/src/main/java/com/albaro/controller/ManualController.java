package com.albaro.controller;

import com.albaro.dto.ManualRequest;
import com.albaro.dto.ManualResponse;
import com.albaro.service.ManualService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manuals")
public class ManualController {
    private final ManualService manualService;

    public ManualController(ManualService manualService) {
        this.manualService = manualService;
    }

    // 모든 메뉴얼 조회
    @GetMapping
    public ResponseEntity<List<ManualResponse>> getAllManuals() {
        return ResponseEntity.ok(manualService.getAllManuals());
    }

    // 특정 메뉴얼 조회 (manualId)
    @GetMapping("/{manualId}")
    public ResponseEntity<ManualResponse> getManualById(@PathVariable Integer manualId) {
        return ResponseEntity.ok(manualService.getManualById(manualId));
    }

    // 메뉴얼 추가
    @PostMapping
    public ResponseEntity<ManualResponse> createManual(@RequestBody ManualRequest manualRequest) {
        return ResponseEntity.ok(manualService.createManual(manualRequest));
    }

    // 메뉴얼 수정
    @PutMapping("/{manualId}")
    public ResponseEntity<ManualResponse> updateManual(@PathVariable Integer manualId, @RequestBody ManualRequest manualRequest) {
        return ResponseEntity.ok(manualService.updateManual(manualId, manualRequest));
    }

    // 메뉴얼 삭제
    @DeleteMapping("/{manualId}")
    public ResponseEntity<Void> deleteManual(@PathVariable Integer manualId) {
        manualService.deleteManual(manualId);
        return ResponseEntity.noContent().build();
    }
}
