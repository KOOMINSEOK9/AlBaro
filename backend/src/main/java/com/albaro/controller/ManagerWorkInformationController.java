package com.albaro.controller;

import com.albaro.dto.ManagerWorkInformationResponse;
import com.albaro.dto.UserDto;
import com.albaro.dto.UserProfileImageResponse;
import com.albaro.service.ManagerWorkInformationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manager")
public class ManagerWorkInformationController {

    private final ManagerWorkInformationService managerWorkInformationService;

    public ManagerWorkInformationController(ManagerWorkInformationService managerWorkInformationService) {
        this.managerWorkInformationService = managerWorkInformationService;
    }

    // 1. 특정 가게에서 공석(isVacant=True)인 근무 정보 조회 (미래 근무만, 현재 달 기준)
    @GetMapping("/vacant/{storeId}")
    public ResponseEntity<List<ManagerWorkInformationResponse>> getVacantWorkInformation(@PathVariable Integer storeId) {
        return ResponseEntity.ok(managerWorkInformationService.getVacantWorkInformation(storeId));
    }

    // 2. 우리 가게 알바생이 대타 근무한 경우 (과거 근무만, 현재 달 기준)
    @GetMapping("/internal-substitutes/{storeId}")
    public ResponseEntity<List<ManagerWorkInformationResponse>> getInternalSubstitutes(@PathVariable Integer storeId) {
        return ResponseEntity.ok(managerWorkInformationService.getInternalSubstitutes(storeId));
    }

    // 3. 외부 알바생이 우리 가게에서 대타 근무한 경우 (과거 근무만, 현재 달 기준)
    @GetMapping("/external-substitutes/{storeId}")
    public ResponseEntity<List<ManagerWorkInformationResponse>> getExternalSubstitutes(@PathVariable Integer storeId) {
        return ResponseEntity.ok(managerWorkInformationService.getExternalSubstitutes(storeId));
    }

    // 4. 우리 가게의 알바생 리스트 조회 (UserDto 활용) - STAFF 역할만 필터링
    @GetMapping("/staff/{storeId}")
    public ResponseEntity<List<UserDto>> getStaffListByStoreId(@PathVariable Integer storeId) {
        return ResponseEntity.ok(managerWorkInformationService.getStaffListByStoreId(storeId));
    }

    // 5. 특정 userId로 userName과 storeName 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<ManagerWorkInformationResponse> getUserWithStoreName(@PathVariable Integer userId) {
        return managerWorkInformationService.getUserWithStoreNameById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 6. 특정 storeId에 해당하는 STAFF 역할의 사용자 목록 조회 (userName 및 filePath 포함)
    @GetMapping("/staff-with-images/{storeId}")
    public ResponseEntity<List<UserProfileImageResponse>> getStaffWithImagesByStoreId(@PathVariable Integer storeId) {
        List<UserProfileImageResponse> staffWithImages = managerWorkInformationService.getStaffWithImagesByStoreId(storeId);
        return ResponseEntity.ok(staffWithImages);
    }
}
