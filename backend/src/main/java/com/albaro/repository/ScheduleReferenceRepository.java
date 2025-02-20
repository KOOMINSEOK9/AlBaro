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
//    @Query("SELECT new com.albaro.dto.UserDto(" +
//            "sr.user.userId, " +
//            "sr.user.userName, " +
//            "sr.scheduleDate, " +
//            "sr.scheduleStartTime, " +
//            "sr.scheduleEndTime) " +
//            "FROM ScheduleReference sr " +
//            "WHERE sr.store.storeId = :storeId")
//    List<UserDto> findWorkersByStoreId(@Param("storeId") Integer storeId);

    @Query("SELECT new com.albaro.dto.UserDto(" +
            "sr.user.userId, " +
            "sr.user.userName, " +
            "sr.scheduleDate, " +
            "sr.scheduleStartTime, " +
            "sr.scheduleEndTime, " +
            "(SELECT upi.filePath FROM UserProfileImage upi WHERE upi.user = sr.user ORDER BY upi.userProfileImageId DESC LIMIT 1)) " +
            "FROM ScheduleReference sr " +
            "WHERE sr.store.storeId = :storeId")
    List<UserDto> findWorkersByStoreId(@Param("storeId") Integer storeId);

    //알바생-> 알바생 로직(내부)
//    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(sr.user.userId, sr.user.userName, sr.scheduleDate, sr.scheduleStartTime, sr.scheduleEndTime) " +
//            "FROM ScheduleReference sr " +
//            "WHERE sr.store.storeId = :storeId " +
//            "AND sr.user.userId != :userId")
//    List<UserDto> findWorkerInInternalStore(@Param("storeId") Integer storeId, @Param("userId") Integer userId);

    //프로필 이미지 넣은 버전
    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(" +
            "sr.user.userId, sr.user.userName, sr.scheduleDate, sr.scheduleStartTime, sr.scheduleEndTime, " +
            "(SELECT upi.filePath FROM UserProfileImage upi WHERE upi.user = sr.user ORDER BY upi.userProfileImageId DESC LIMIT 1)) " +
            "FROM ScheduleReference sr " +
            "WHERE sr.store.storeId = :storeId " +
            "AND sr.user.userId != :userId")
    List<UserDto> findWorkerInInternalStore(@Param("storeId") Integer storeId, @Param("userId") Integer userId);


    //알바생-> 알바생 로직(외부)
//    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(sr.user.userId, sr.user.userName, sr.scheduleDate, sr.scheduleStartTime, sr.scheduleEndTime) FROM ScheduleReference sr WHERE sr.store.storeId IN :storeIdList AND sr.user.userId != :excludeUserId")
//    List<UserDto> findWorkersInExternalStore(@Param("storeIdList") List<Integer> storeIdList, @Param("excludeUserId") Integer excludeUserId);

    //프로필 이미지 넣은 버전
    @Query("SELECT DISTINCT new com.albaro.dto.UserDto(" +
            "sr.user.userId, " +
            "sr.user.userName, " +
            "sr.scheduleDate, " +
            "sr.scheduleStartTime, " +
            "sr.scheduleEndTime, " +
            "(SELECT upi.filePath FROM UserProfileImage upi WHERE upi.user = sr.user ORDER BY upi.userProfileImageId DESC LIMIT 1)) " +
            "FROM ScheduleReference sr " +
            "WHERE sr.store.storeId IN :storeIdList " +
            "AND sr.store.storeId != :userStoreId " +
            "AND sr.user.userId != :excludeUserId")
    List<UserDto> findWorkersInExternalStore(@Param("storeIdList") List<Integer> storeIdList, @Param("excludeUserId") Integer excludeUserId, @Param("userStoreId") Integer userStoreId);


}
