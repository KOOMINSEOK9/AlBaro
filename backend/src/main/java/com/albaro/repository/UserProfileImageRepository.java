package com.albaro.repository;

import com.albaro.entity.UserProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileImageRepository extends JpaRepository<UserProfileImage, Integer> {

    // 특정 userId의 프로필 이미지 조회 (단일)
    Optional<UserProfileImage> findByUserUserId(Integer userId);

    // 특정 storeId에 속한 모든 사용자들의 프로필 이미지 조회 (복수)
    List<UserProfileImage> findByUser_Store_StoreId(Integer storeId);
}
