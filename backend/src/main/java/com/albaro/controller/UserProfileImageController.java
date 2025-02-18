package com.albaro.controller;

import com.albaro.dto.UserProfileImageResponse;
import com.albaro.service.UserProfileImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileImageController {

    private final UserProfileImageService userProfileImageService;

    public UserProfileImageController(UserProfileImageService userProfileImageService) {
        this.userProfileImageService = userProfileImageService;
    }

    // 1. userId로 프로필 이미지 조회 (단일)
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileImageResponse> getUserProfileImageByUserId(@PathVariable Integer userId) {
        Optional<UserProfileImageResponse> userProfileImage = userProfileImageService.getUserProfileImageByUserId(userId);
        return userProfileImage.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 2. storeId로 해당 가게의 직원 프로필 이미지 조회 (복수)
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<UserProfileImageResponse>> getUserProfileImagesByStoreId(@PathVariable Integer storeId) {
        List<UserProfileImageResponse> userProfileImages = userProfileImageService.getUserProfileImagesByStoreId(storeId);
        return ResponseEntity.ok(userProfileImages);
    }
}
