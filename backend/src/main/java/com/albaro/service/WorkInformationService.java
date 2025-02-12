package com.albaro.service;

import com.albaro.dto.WorkInformationResponse;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.UserRepository;
import com.albaro.repository.WorkInformationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkInformationService {

    @Autowired
    private WorkInformationRepository workInformationRepository;

    @Autowired
    private UserRepository userRepository;  // 사용자 정보를 조회할 수 있는 Repository 추가

    // 특정 storeId의 모든 근무 정보를 가져오는 서비스 메서드
    public List<WorkInformationResponse> getWorkInformationByStoreId(Integer storeId) {
        List<WorkInformation> workInformations = workInformationRepository.findByStore_StoreId(storeId);

        // DTO로 변환하여 반환
        return workInformations.stream()
                .map(workInfo -> {
                    // realTimeWorker(accountId)를 통해 userName을 가져옴
                    String userName = getUserNameByAccountId(workInfo.getRealTimeWorker());

                    return new WorkInformationResponse(
                            workInfo.getScheduleId(),
                            workInfo.getWorkDate(),
                            workInfo.getStartTime(),
                            workInfo.getEndTime(),
                            workInfo.getVacant(),
                            workInfo.getCheckInTime(),
                            workInfo.getCheckOutTime(),
                            workInfo.getRealTimeWorker(),
                            userName,
                            workInfo.getUser().getAccountId(), // 💡 accountId 변환 추가
                            workInfo.getUser().getUserId()
                    );
                })
                .collect(Collectors.toList());
    }

    // realTimeWorker(accountId)를 통해 userName을 가져오는 메서드
    private String getUserNameByAccountId(Integer accountId) {
        // 해당 accountId에 해당하는 사용자 정보 조회
        return userRepository.findByAccountId(accountId)
                .map(User::getUserName)  // 사용자 이름 반환
                .orElse("Unknown User");  // 사용자 이름이 없을 경우 기본값 반환
    }

    // 스케줄 삭제
    public void deleteSchedule(Integer scheduleId) {
        workInformationRepository.deleteById(scheduleId);
    }

    // 근무 공석 처리
    @Transactional
    public void markAsVacant(Integer scheduleId) {
        WorkInformation workInfo = workInformationRepository.findById(scheduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Schedule not found with id: " + scheduleId));

        workInfo.setVacant(true);
        workInformationRepository.save(workInfo);
    }
}

