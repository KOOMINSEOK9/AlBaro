
package com.albaro.repository;

import com.albaro.entity.Store;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
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

    //대타 요청 수락 시 근무 정보 수정
    @Modifying
    @Transactional
    @Query("UPDATE WorkInformation w " +
            "SET w.realTimeWorker = :workerId, " +
            "w.isVacant = false " +
            "WHERE w.workDate = :workDate " +
            "AND w.store.storeId = :storeId " +  // store.id를 store.storeId로 수정
            "AND w.startTime = :startTime " +
            "AND w.endTime = :endTime")
    void updateWorkerAndVacantStatus(
            @Param("workerId") Integer workerId,
            @Param("workDate") LocalDate workDate,
            @Param("storeId") Integer storeId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    //QR코드 인식 통한 근무 정보 업데이트
    @Query("SELECT w FROM WorkInformation w " +
            "WHERE w.realTimeWorker = :realTimeWorker " +
            "AND w.workDate = :workDate " +
            "AND w.store.storeId = :storeId")
    Optional<WorkInformation> findWorkInformation(
            @Param("realTimeWorker") Integer realTimeWorker,
            @Param("workDate") LocalDate workDate,
            @Param("storeId") Integer storeId
    );

    // 출근 시간 업데이트
    @Modifying
    @Transactional
    @Query("UPDATE WorkInformation w " +
            "SET w.checkInTime = :checkInTime " +
            "WHERE w.realTimeWorker = :realTimeWorker " +
            "AND w.workDate = :workDate " +
            "AND w.store.storeId = :storeId")
    void updateCheckInTime(
            @Param("realTimeWorker") Integer realTimeWorker,
            @Param("workDate") LocalDate workDate,
            @Param("storeId") Integer storeId,
            @Param("checkInTime") LocalTime checkInTime
    );

    // 퇴근 시간 업데이트
    @Modifying
    @Transactional
    @Query("UPDATE WorkInformation w " +
            "SET w.checkOutTime = :checkOutTime " +
            "WHERE w.realTimeWorker = :realTimeWorker " +
            "AND w.workDate = :workDate " +
            "AND w.store.storeId = :storeId")
    void updateCheckOutTime(
            @Param("realTimeWorker") Integer realTimeWorker,
            @Param("workDate") LocalDate workDate,
            @Param("storeId") Integer storeId,
            @Param("checkOutTime") LocalTime checkOutTime
    );





}
