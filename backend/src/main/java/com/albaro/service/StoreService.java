package com.albaro.service;

import com.albaro.dto.StoreDto;
import com.albaro.entity.Store;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.ScheduleReferenceRepository;
import com.albaro.repository.StoreRepository;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
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
    public List<StoreDto> findNearbyStoresAndWorkers(int userId, int storeId) {

        //시용자의 storeId 조회
        Integer userStoreId = userRepository.findStoreIdByUserId(userId);

        // 찾은 storeId로 지점 조회
        Store userStoreEntity = storeRepository.findById(userStoreId)
                .orElseThrow(() -> new RuntimeException("User's store not found"));

        // 반경 5KM 내 지점 조회(위도/경도 기반 필터링)
        double searchRadius = 5.0;
        List<Store> nearbyStoreEntities = storeRepository.findNearbyStores(
                userStoreEntity.getLatitude(),
                userStoreEntity.getLongitude(),
                searchRadius);

        // 각 지점별 근무 가능한 알바생 조회 및 DTO 변환
        List<StoreDto> nearbyStoreList = nearbyStoreEntities.stream()
                .map(store -> {
                    List<Integer> availableWorkers =
                            scheduleReferenceRepository.findWorkerIdsByStoreId(store.getStoreId());
                    return StoreDto.fromEntity(store, availableWorkers);
                })
                .collect(Collectors.toList());

        // 사용자의 근무 지점을 리스트 맨 앞에 배치
        List<Integer> userStoreWorkers =
                scheduleReferenceRepository.findWorkerIdsByStoreId(userStoreEntity.getStoreId());
        StoreDto userStoreDto = StoreDto.fromEntity(userStoreEntity, userStoreWorkers);
        nearbyStoreList.removeIf(dto -> dto.getStoreId().equals(userStoreDto.getStoreId()));
        nearbyStoreList.add(0, userStoreDto);

        return nearbyStoreList;
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

}
