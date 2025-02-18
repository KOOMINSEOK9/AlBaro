package com.albaro.controller;

import com.albaro.dto.UserWorkInformationResponse;
import com.albaro.service.UserWorkInformationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-work")
public class UserWorkInformationController {

    private final UserWorkInformationService userWorkInformationService;

    public UserWorkInformationController(UserWorkInformationService userWorkInformationService) {
        this.userWorkInformationService = userWorkInformationService;
    }

    // 1. 특정 사용자의 결근한 근무 조회
        @GetMapping("/absent/{userId}")
    public ResponseEntity<List<UserWorkInformationResponse>> getAbsentWorkInformation(@PathVariable Integer userId) {
            System.out.println(userId);
        List<UserWorkInformationResponse> absentWork = userWorkInformationService.getAbsentWorkInformation(userId);
        return ResponseEntity.ok(absentWork);
    }

    // 2. 특정 사용자의 대타 근무 조회
    @GetMapping("/substituted/{userId}")
    public ResponseEntity<List<UserWorkInformationResponse>> getSubstitutedWorkInformation(@PathVariable Integer userId) {
        List<UserWorkInformationResponse> substitutedWork = userWorkInformationService.getSubstitutedWorkInformation(userId);
        return ResponseEntity.ok(substitutedWork);
    }

    // 3. 특정 사용자의 근무시간 변화량 조회 (결근 근무시간 - 대타 근무시간 합산 값 반환)
    @GetMapping("/total-change-time/{userId}")
    public ResponseEntity<Integer> getWorkTimeChange(@PathVariable Integer userId) {
        Integer workTimeChange = userWorkInformationService.getWorkTimeChange(userId);
        return ResponseEntity.ok(workTimeChange);
    }

    // 4. 특정 userId로 userName과 storeName 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserWorkInformationResponse> getUserWithStoreName(@PathVariable Integer userId) {
        return userWorkInformationService.getUserWithStoreNameById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
