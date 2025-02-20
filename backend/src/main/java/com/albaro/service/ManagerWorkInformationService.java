package com.albaro.service;

import com.albaro.dto.ManagerWorkInformationResponse;
import com.albaro.dto.UserDto;
import com.albaro.dto.UserProfileImageResponse;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
                .filter(info -> info.getStore() != null && info.getStore().getStoreId().equals(storeId))
                .filter(WorkInformation::getVacant)
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear())
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth())
                .map(info -> new ManagerWorkInformationResponse(info, userRepository))
                .collect(Collectors.toList());
    }

    // 2. 우리 가게 알바생이 대타 근무한 경우 (과거 근무만, 현재 달 기준)
    public List<ManagerWorkInformationResponse> getInternalSubstitutes(Integer storeId) {
        List<Integer> storeUserIds = userRepository.findAll().stream()
                .filter(user -> user.getStore() != null && user.getStore().getStoreId().equals(storeId))
                .map(User::getUserId)
                .collect(Collectors.toList());

        return workInformationRepository.findAll().stream()
                .filter(info -> info.getStore() != null && info.getStore().getStoreId().equals(storeId))
                .filter(info -> storeUserIds.contains(info.getRealTimeWorker()))
                .filter(info -> !info.getUser().getUserId().equals(info.getRealTimeWorker()))
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear())
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth())
                .filter(info -> LocalDateTime.now().isAfter(info.getWorkDate().atTime(info.getEndTime())))
                .map(info -> new ManagerWorkInformationResponse(info, userRepository))
                .collect(Collectors.toList());
    }

    // 3. 외부 알바생이 우리 가게에서 대타 근무한 경우 (과거 근무만, 현재 달 기준)
    public List<ManagerWorkInformationResponse> getExternalSubstitutes(Integer storeId) {
        List<Integer> storeUserIds = userRepository.findAll().stream()
                .filter(user -> user.getStore() != null && user.getStore().getStoreId().equals(storeId))
                .map(User::getUserId)
                .collect(Collectors.toList());

        return workInformationRepository.findAll().stream()
                .filter(info -> info.getStore() != null && info.getStore().getStoreId().equals(storeId))
                .filter(info -> !storeUserIds.contains(info.getRealTimeWorker()))
                .filter(info -> info.getWorkDate().getYear() == LocalDateTime.now().getYear())
                .filter(info -> info.getWorkDate().getMonth() == LocalDateTime.now().getMonth())
                .filter(info -> LocalDateTime.now().isAfter(info.getWorkDate().atTime(info.getEndTime())))
                .map(info -> new ManagerWorkInformationResponse(info, userRepository))
                .collect(Collectors.toList());
    }

    // 4. 우리 가게의 알바생 리스트 조회 (UserDto 활용) - STAFF 역할만 필터링
    public List<UserDto> getStaffListByStoreId(Integer storeId) {
        return userRepository.findAll().stream()
                .filter(user -> user.getStore() != null && user.getStore().getStoreId().equals(storeId))
                .filter(user -> "staff".equalsIgnoreCase(user.getRole()))
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 5. 특정 userId로 userName과 storeName 조회
    public Optional<ManagerWorkInformationResponse> getUserWithStoreNameById(Integer userId) {
        return userRepository.findById(userId)
                .map(user -> new ManagerWorkInformationResponse(user.getUserId(), user.getUserName(), user.getStore().getStoreName()));
    }

    // 새로운 메서드: storeId에 해당하는 STAFF 역할의 사용자 목록 반환 (userName과 filePath 포함)
    public List<UserProfileImageResponse> getStaffWithImagesByStoreId(Integer storeId) {
        return userRepository.findAll().stream()
                .filter(user -> user.getStore() != null && user.getStore().getStoreId().equals(storeId))
                .filter(user -> "staff".equalsIgnoreCase(user.getRole()))
                .map(user -> {
                    String filePath = (user.getUserProfileImage() != null)
                            ? user.getUserProfileImage().getFilePath()
                            : null;
                    return new UserProfileImageResponse(user.getUserName(), filePath);
                })
                .collect(Collectors.toList());
    }
}