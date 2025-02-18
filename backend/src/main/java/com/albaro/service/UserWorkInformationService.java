package com.albaro.service;

import com.albaro.dto.UserWorkInformationResponse;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserWorkInformationService {

    private final WorkInformationRepository workInformationRepository;
    private final UserRepository userRepository;

    public UserWorkInformationService(WorkInformationRepository workInformationRepository, UserRepository userRepository) {
        this.workInformationRepository = workInformationRepository;
        this.userRepository = userRepository;
    }

    // 1. 특정 사용자의 결근한 근무 기록 조회
    public List<UserWorkInformationResponse> getAbsentWorkInformation(Integer userId) {

        Integer accountId = userRepository.findAccountIdByUserId(userId);

        return workInformationRepository.findAll().stream()
                .filter(info -> info.getUser() != null && info.getUser().getUserId().equals(userId))
                .filter(info -> info.getRealTimeWorker() != null && !info.getRealTimeWorker().equals(accountId))
                .filter(info -> LocalDateTime.now().isAfter(info.getWorkDate().atTime(info.getEndTime())))
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear())
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth())
                .map(info -> new UserWorkInformationResponse(info, userRepository))
                .collect(Collectors.toList());
    }

    // 2. 특정 사용자가 대타 근무한 기록 조회
    public List<UserWorkInformationResponse> getSubstitutedWorkInformation(Integer userId) {

        Integer accountId = userRepository.findAccountIdByUserId(userId);

        return workInformationRepository.findAll().stream()
                .filter(info -> info.getRealTimeWorker() != null && info.getRealTimeWorker().equals(accountId))
                .filter(info -> !info.getUser().getUserId().equals(userId))
                .filter(info -> LocalDateTime.now().isAfter(info.getWorkDate().atTime(info.getEndTime())))
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear())
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth())
                .map(info -> new UserWorkInformationResponse(info, userRepository))
                .collect(Collectors.toList());
    }

    // 3. 특정 사용자의 근무시간 변화량 집계 계산
    public Integer getWorkTimeChange(Integer userId) {
        // 결근한 근무 총 시간 (-값)
        int absentHours = getAbsentWorkInformation(userId).stream()
                .mapToInt(info -> (int) ChronoUnit.HOURS.between(info.getStartTime(), info.getEndTime()))
                .sum();

        // 대타한 근무 총 시간 (+값)
        int substitutedHours = getSubstitutedWorkInformation(userId).stream()
                .mapToInt(info -> (int) ChronoUnit.HOURS.between(info.getStartTime(), info.getEndTime()))
                .sum();

        System.out.println(substitutedHours);
        System.out.println(absentHours);

        // 최종 결과 반환 (대타 근무 - 결근 근무)
        return substitutedHours - absentHours;
    }

    // 4. 특정 userId로 userName과 storeName 조회 (새로운 기능 추가)
    public Optional<UserWorkInformationResponse> getUserWithStoreNameById(Integer userId) {
        return userRepository.findById(userId)
                .map(user -> new UserWorkInformationResponse(user.getUserId(), user.getUserName(), user.getStore().getStoreName()));
    }
}
