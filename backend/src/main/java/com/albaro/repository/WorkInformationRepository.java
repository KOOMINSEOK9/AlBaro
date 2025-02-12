package com.albaro.repository;

import com.albaro.entity.Store;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface WorkInformationRepository extends JpaRepository<WorkInformation, Integer> {
    List<WorkInformation> findByStore_StoreId(Integer storeId);

    // 특정 지점, 날짜, 시간 대에 공석이 있는지 확인(알바생 -> 지점 리스트 조회)
    @Query("SELECT w FROM WorkInformation w " +
            "WHERE w.store.id = :storeId " +
            "AND w.isVacant = true")
    List<WorkInformation> findVacantSchedule(
            @Param("storeId") int storeId
    );

    // 특정 유저의 근무 기록 조회
    List<WorkInformation> findByUser(User user);

    // 특정 가게에서 특정 날짜의 근무자 조회
    List<WorkInformation> findByStoreAndWorkDate(Store store, LocalDate workDate);

    // 지점별 근무 가능한 알바생 조회( 점장 -> 알바생 찾기)
    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN ScheduleReference sr ON sr.user = u " +
            "WHERE sr.store.id = :storeId " +
            "AND u.role = 'staff'")
    List<User> findAvailableWorkersByStore(@Param("storeId") int storeId);

}
