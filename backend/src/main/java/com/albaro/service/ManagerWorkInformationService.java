package com.albaro.service;

import com.albaro.entity.WorkInformation;
import com.albaro.entity.User;
import com.albaro.dto.ManagerWorkInformationResponse;
import com.albaro.repository.WorkInformationRepository;
import com.albaro.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManagerWorkInformationService {

    private final WorkInformationRepository workInformationRepository;
    private final UserRepository userRepository;

    public ManagerWorkInformationService(WorkInformationRepository workInformationRepository, UserRepository userRepository) {
        this.workInformationRepository = workInformationRepository;
        this.userRepository = userRepository;
    }

    // 1. 특정 가게에서 공석(isVacant=True)인 근무 정보 조회 (미래 근무만, 현재 달 기준)
    public List<ManagerWorkInformationResponse> getVacantWorkInformation(Integer storeId) {
        return workInformationRepository.findAll().stream()
                .filter(info -> info.getStore() != null && info.getStore().getStoreId().equals(storeId)) // 특정 가게
                .filter(WorkInformation::getVacant) // 공석 여부
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear()) // 현재 연도
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth()) // 현재 월
                .map(info -> new ManagerWorkInformationResponse(info, userRepository)) // UserRepository 전달
                .collect(Collectors.toList());
    }

    // 2. 우리 가게 알바생이 대타 근무한 경우 (과거 근무만, 현재 달 기준)
    public List<ManagerWorkInformationResponse> getInternalSubstitutes(Integer storeId) {
        List<Integer> storeUserIds = userRepository.findAll().stream()
                .filter(user -> user.getStore() != null && user.getStore().getStoreId().equals(storeId))
                .map(User::getUserId)
                .collect(Collectors.toList());

        return workInformationRepository.findAll().stream()
                .filter(info -> info.getStore() != null && info.getStore().getStoreId().equals(storeId)) // 특정 가게
                .filter(info -> storeUserIds.contains(info.getRealTimeWorker())) // 우리 가게 알바생이 대타 근무한 경우
                .filter(info -> !info.getUser().getUserId().equals(info.getRealTimeWorker())) // 본인이 아닌 경우
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear()) // 현재 연도
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth()) // 현재 월
                .filter(info -> LocalDateTime.now().isAfter(info.getWorkDate().atTime(info.getEndTime()))) // 현재 시간 이전의 근무만 필터링 (과거)
                .map(info -> new ManagerWorkInformationResponse(info, userRepository)) // UserRepository 전달
                .collect(Collectors.toList());
    }

    // 3. 외부 알바생이 우리 가게에서 대타 근무한 경우 (과거 근무만, 현재 달 기준)
    public List<ManagerWorkInformationResponse> getExternalSubstitutes(Integer storeId) {
        List<Integer> storeUserIds = userRepository.findAll().stream()
                .filter(user -> user.getStore() != null && user.getStore().getStoreId().equals(storeId)) // 해당 가게의 직원 목록 가져오기
                .map(User::getUserId)
                .collect(Collectors.toList());

        return workInformationRepository.findAll().stream()
                .filter(info -> info.getStore() != null && info.getStore().getStoreId().equals(storeId)) // 특정 가게
                .filter(info -> !storeUserIds.contains(info.getRealTimeWorker())) // 외부 알바생이 대타 근무한 경우
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear()) // 현재 연도
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth()) // 현재 월
                .filter(info -> LocalDateTime.now().isAfter(info.getWorkDate().atTime(info.getEndTime()))) // 현재 시간 이전의 근무만 필터링 (과거)
                .map(info -> new ManagerWorkInformationResponse(info, userRepository)) // UserRepository 전달
                .collect(Collectors.toList());
    }
}
