package com.albaro.repository;

import com.albaro.entity.FaceEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaceEmbeddingRepository extends JpaRepository<FaceEmbedding, Long> {
    // 필요한 경우 커스텀 쿼리 메서드 추가
    FaceEmbedding findByUserId(String userId);
}