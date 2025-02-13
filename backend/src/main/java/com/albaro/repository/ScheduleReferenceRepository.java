package com.albaro.repository;

import com.albaro.entity.ScheduleReference;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleReferenceRepository extends JpaRepository<ScheduleReference, Integer> {
    // userId로 해당 월과 연도의 일정 조회 (현재 연도 & 월 기준)
    @Query("SELECT s FROM ScheduleReference s WHERE s.user.userId = :userId " +
            "AND YEAR(s.scheduleDate) = YEAR(CURRENT_DATE) " +
            "AND MONTH(s.scheduleDate) = MONTH(CURRENT_DATE)")
    List<ScheduleReference> findByUserIdAndCurrentMonth(@Param("userId") Integer userId);

    @Query("SELECT DISTINCT sr.user.userId FROM ScheduleReference sr WHERE sr.store.storeId = :storeId")
    List<Integer> findWorkerIdsByStoreId(@Param("storeId") Integer storeId);

    // ScheduleReferenceRepository에 새로운 메서드 추가
    @Query("SELECT DISTINCT sr.user.userId FROM ScheduleReference sr WHERE sr.store.storeId = :storeId AND sr.user.userId != :excludeUserId")
    List<Integer> findWorkerIdsByStoreIdExcludeUser(@Param("storeId") Integer storeId, @Param("excludeUserId") Integer excludeUserId);

}
