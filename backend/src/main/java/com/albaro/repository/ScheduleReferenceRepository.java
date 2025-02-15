package com.albaro.repository;

import com.albaro.dto.StoreDto;
import com.albaro.dto.UserDto;
import com.albaro.entity.ScheduleReference;
import org.springframework.data.repository.query.Param;
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

    //점장 -> 공석채우기
    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(sr.user.userId, sr.user.userName) " +
            "FROM ScheduleReference sr " +
            "WHERE sr.store.storeId = :storeId")
    List<UserDto> findWorkersByStoreId(@Param("storeId") Integer storeId);

    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(sr.user.userId, sr.user.userName, sr.scheduleDate, sr.scheduleStartTime, sr.scheduleEndTime) " +
            "FROM ScheduleReference sr WHERE sr.store.storeId = :storeId")
    List<UserDto> findWorkerIdsByStoreId(@Param("storeId") Integer storeId);

//    // ScheduleReferenceRepository에 새로운 메서드 추가
//    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(sr.user.userId, sr.user.userName) FROM ScheduleReference sr WHERE sr.store.storeId = :storeId AND sr.user.userId != :excludeUserId")
//    List<UserDto> findWorkersByStoreIdExcludeUser(@Param("storeId") Integer storeId, @Param("excludeUserId") Integer excludeUserId);

    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(sr.user.userId, sr.user.userName, sr.scheduleDate, sr.scheduleStartTime, sr.scheduleEndTime) FROM ScheduleReference sr WHERE sr.store.storeId IN :storeIdList AND sr.user.userId != :excludeUserId")
    List<UserDto> findWorkersInExternalStore(@Param("storeIdList") List<Integer> storeIdList, @Param("excludeUserId") Integer excludeUserId);


}
