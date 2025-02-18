package com.albaro.service;

import com.albaro.dto.UserProfileImageResponse;
import com.albaro.entity.UserProfileImage;
import com.albaro.repository.UserProfileImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileImageService {

    private final UserProfileImageRepository userProfileImageRepository;

    public UserProfileImageService(UserProfileImageRepository userProfileImageRepository) {
        this.userProfileImageRepository = userProfileImageRepository;
    }

    // 1. userId로 특정 사용자의 프로필 이미지 조회 (단일)
    public Optional<UserProfileImageResponse> getUserProfileImageByUserId(Integer userId) {
        return userProfileImageRepository.findByUserUserId(userId)
                .map(UserProfileImageResponse::fromEntity);
    }

    // 2. storeId로 특정 가게의 모든 직원 프로필 이미지 조회 (복수)
    public List<UserProfileImageResponse> getUserProfileImagesByStoreId(Integer storeId) {
        return userProfileImageRepository.findByUser_Store_StoreId(storeId)
                .stream()
                .map(UserProfileImageResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
