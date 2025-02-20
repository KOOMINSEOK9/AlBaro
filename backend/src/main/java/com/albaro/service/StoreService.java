package com.albaro.service;

import com.albaro.dto.StoreDto;
import com.albaro.dto.UserDto;
import com.albaro.entity.Store;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.ScheduleReferenceRepository;
import com.albaro.repository.StoreRepository;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final WorkInformationRepository workInformationRepository;
    private final UserRepository userRepository;
    private final ScheduleReferenceRepository scheduleReferenceRepository;

    public StoreService(StoreRepository storeRepository, WorkInformationRepository workInformationRepository, UserRepository userRepository, ScheduleReferenceRepository scheduleReferenceRepository){
        this.storeRepository = storeRepository;
        this.workInformationRepository = workInformationRepository;
        this.userRepository = userRepository;
        this.scheduleReferenceRepository = scheduleReferenceRepository;
    }

    // -------------------------(알바생 -> 지점 찾기 로직)--------------------------------

    //반경 내 지점 리스트 조회(알바생 -> 지점 찾기)
    public List<StoreDto> findNearbyStores(int userId) {

        // 사용자의 근무 지점 조회
        int storeId = userRepository.findStoreIdByUserId(userId);
        Store userStoreEntity  = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("User's store not found"));

        // 반경 ( )KM 내 지점 조회(위도/경도 기반 필터링)
        double searchRadius = 5.0;
        List<Store> nearbyStoreEntities = storeRepository.findNearbyStores(
                userStoreEntity.getLatitude(), userStoreEntity.getLongitude(),searchRadius);

        // DTO 변환
        List<StoreDto> nearbyStoreList = nearbyStoreEntities.stream()
                .map(StoreDto::fromEntity)
                .collect(Collectors.toList());

        // 사용자의 근무 지점을 리스트 맨 앞에 배치
        StoreDto userStoreDto = StoreDto.fromEntity(userStoreEntity);
        nearbyStoreList.removeIf(dto -> dto.getStoreId() == userStoreDto.getStoreId());
        nearbyStoreList.add(0, userStoreDto);

        return nearbyStoreList;
    }


    // 선택한 지점의 공석 확인
    public List<WorkInformation> checkVacantSchedule(int storeId) {
        // 입력값 검증
//        validateSearchConditions(workDate, startTime, endTime);

        return workInformationRepository.findVacantSchedule(storeId);
    }


    // --------------------------(점장 공석채우기(알바생 찾기) 로직)--------------------------------

    //주변 지점 리스트 내의 근무 가능한 알바생 표시
    public List<UserDto> findWorkersInStores(Integer storeId) {

        List<UserDto> availableWorkers = scheduleReferenceRepository.findWorkersByStoreId(storeId);

        return availableWorkers;
    }

    // --------------------------(알바생 -> 알바생 대타 요청 로직)------------------------------

    //1. 사용자의 지점에서 근무 가능한 알바생 리스트 출력
    public List<UserDto> findWorkersInUserStore(int userId){

        // 사용자의 storeId 조회
        Integer userStoreId = userRepository.findStoreIdByUserId(userId);
        System.out.println("userstoreId" + userStoreId);
        if (userStoreId == null) {
            throw new RuntimeException("사용자의 지점이 조회되지 않습니다.");
        }

        //storeId로 사용자 지점의 근무 가능한 시간이 있는 알바생 조회
        List<UserDto> workersInUserStore = scheduleReferenceRepository.findWorkerInInternalStore(userStoreId,userId);
        if(workersInUserStore.isEmpty() || workersInUserStore == null){
            throw new RuntimeException("근무 가능한 알바생이 없습니다.");
        }

        return workersInUserStore;
    }

    //2.사용자 외부 지점에서 근무 가능한 알바생 리스트 출력
    public List<UserDto> findWorkersInExternalStore(int userId){

        // 사용자의 storeId 조회
        Integer userStoreId = userRepository.findStoreIdByUserId(userId);
        if (userStoreId == null) {
            throw new RuntimeException("User's store not found");
        }

        // 찾은 storeId로 지점 조회
        Store userStoreEntity = storeRepository.findById(userStoreId)
                .orElseThrow(() -> new RuntimeException("User's store not found"));

        // 반경 5KM 내 지점 조회(위도/경도 기반 필터링)
        double searchRadius = 5.0;
        List<Integer> nearbyStoreIds = storeRepository.findNearbyStoreIds(
                userStoreEntity.getLatitude(),
                userStoreEntity.getLongitude(),
                searchRadius);

        System.out.println("-----------------------------");
        System.out.println(nearbyStoreIds);

        //만약 그 리스트 안에 storeId가 있다면 그 사람의 id와 Name 리스트로 출력
        List<UserDto> externalWorkerList = scheduleReferenceRepository.findWorkersInExternalStore(nearbyStoreIds, userId, userStoreId);

        return externalWorkerList;
    }





    // 검색 조건 유효성 검사
    private void validateSearchConditions(LocalDate workDate, LocalTime startTime, LocalTime endTime) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        if (workDate.isBefore(today)) {
            throw new IllegalArgumentException("과거 날짜는 선택할 수 없습니다.");
        }

        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("시작 시간이 종료 시간보다 늦을 수 없습니다.");
        }

        if (workDate.equals(today) && startTime.isBefore(now.toLocalTime())) {
            throw new IllegalArgumentException("현재 시간 이후의 시간대만 선택 가능합니다.");
        }
    }

    public Optional<Store> getStoreById(Integer storeId) {
        return storeRepository.findByStoreId(storeId);
    }
}
