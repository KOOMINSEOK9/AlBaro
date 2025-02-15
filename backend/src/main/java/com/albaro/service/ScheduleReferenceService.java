package com.albaro.service;

import com.albaro.dto.ScheduleReferenceRequest;
import com.albaro.dto.ScheduleReferenceResponse;
import com.albaro.entity.ScheduleReference;
import com.albaro.entity.Store;
import com.albaro.entity.User;
import com.albaro.repository.ScheduleReferenceRepository;
import com.albaro.repository.StoreRepository;
import com.albaro.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleReferenceService {
    private final ScheduleReferenceRepository scheduleReferenceRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    public ScheduleReferenceService(ScheduleReferenceRepository scheduleReferenceRepository, UserRepository userRepository, StoreRepository storeRepository) {
        this.scheduleReferenceRepository = scheduleReferenceRepository;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
    }

    // 모든 일정 조회(모든 스케줄)
    public List<ScheduleReferenceResponse> getAllScheduleReferences() {
        return scheduleReferenceRepository.findAll()
                .stream()
                .map(ScheduleReferenceResponse::new)
                .collect(Collectors.toList());
    }

    // 일정 조회(특정 스케줄)
    public ScheduleReferenceResponse getScheduleReferenceById(Integer scheduleReferenceId) {
        ScheduleReference scheduleReference = scheduleReferenceRepository.findById(scheduleReferenceId)
                .orElseThrow(() -> new RuntimeException("ScheduleReference not found with id: " + scheduleReferenceId));

        return new ScheduleReferenceResponse(scheduleReference);
    }


    // 특정 사용자의 일정 조회 (현재 연도 & 월 기준)
    public List<ScheduleReferenceResponse> getUserScheduleForCurrentMonth(Integer userId) {
        List<ScheduleReference> schedules = scheduleReferenceRepository.findByUserIdAndCurrentMonth(userId);
        return schedules.stream()
                .map(ScheduleReferenceResponse::new)
                .collect(Collectors.toList());
    }


    // 일정 생성
    public ScheduleReferenceResponse createScheduleReference(ScheduleReferenceRequest scheduleRequest) {
        User user = userRepository.findById(scheduleRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + scheduleRequest.getUserId()));

        Store store = storeRepository.findById(scheduleRequest.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + scheduleRequest.getStoreId()));

        ScheduleReference scheduleReference = scheduleRequest.toEntity(user, store);
        ScheduleReference savedScheduleReference = scheduleReferenceRepository.save(scheduleReference);

        return new ScheduleReferenceResponse(savedScheduleReference);
    }

    // 일정 수정
    public ScheduleReferenceResponse updateScheduleReference(Integer scheduleReferenceId, ScheduleReferenceRequest scheduleRequest) {
        ScheduleReference scheduleReference = scheduleReferenceRepository.findById(scheduleReferenceId)
                .orElseThrow(() -> new RuntimeException("ScheduleReference not found with id: " + scheduleReferenceId));

        User user = userRepository.findById(scheduleRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + scheduleRequest.getUserId()));

        Store store = storeRepository.findById(scheduleRequest.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + scheduleRequest.getStoreId()));

        scheduleReference.setUser(user);
        scheduleReference.setStore(store);
        scheduleReference.setScheduleDate(scheduleRequest.getScheduleDate());
        scheduleReference.setScheduleStartTime(scheduleRequest.getScheduleStartTime());
        scheduleReference.setScheduleEndTime(scheduleRequest.getScheduleEndTime());

        ScheduleReference updatedScheduleReference = scheduleReferenceRepository.save(scheduleReference);
        return new ScheduleReferenceResponse(updatedScheduleReference);
    }

    // 일정 삭제
    public void deleteScheduleReference(Integer scheduleReferenceId) {
        if (!scheduleReferenceRepository.existsById(scheduleReferenceId)) {
            throw new RuntimeException("ScheduleReference not found with id: " + scheduleReferenceId);
        }
        scheduleReferenceRepository.deleteById(scheduleReferenceId);
    }
}
