package com.albaro.service;

import com.albaro.dto.ManualRequest;
import com.albaro.dto.ManualResponse;
import com.albaro.entity.Manual;
import com.albaro.entity.Store;
import com.albaro.repository.ManualRepository;
import com.albaro.repository.StoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManualService {
    private final ManualRepository manualRepository;
    private final StoreRepository storeRepository;

    public ManualService(ManualRepository manualRepository, StoreRepository storeRepository) {
        this.manualRepository = manualRepository;
        this.storeRepository = storeRepository;
    }

    // 모든 메뉴얼 조회
    public List<ManualResponse> getAllManuals() {
        return manualRepository.findAll().stream()
                .map(ManualResponse::new)
                .collect(Collectors.toList());
    }

    // 특정 메뉴얼 조회
    public ManualResponse getManualById(Integer manualId) {
        Manual manual = manualRepository.findById(manualId)
                .orElseThrow(() -> new RuntimeException("Manual not found with id: " + manualId));
        return new ManualResponse(manual);
    }

    // 메뉴얼 생성
    public ManualResponse createManual(ManualRequest manualRequest) {
        Store store = storeRepository.findById(manualRequest.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + manualRequest.getStoreId()));

        Manual manual = manualRequest.toEntity(store);
        return new ManualResponse(manualRepository.save(manual));
    }

    // 메뉴얼 수정
    public ManualResponse updateManual(Integer manualId, ManualRequest manualRequest) {
        Manual manual = manualRepository.findById(manualId)
                .orElseThrow(() -> new RuntimeException("Manual not found with id: " + manualId));

        Store store = storeRepository.findById(manualRequest.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + manualRequest.getStoreId()));

        manual.setManualName(manualRequest.getManualName());
        manual.setCategory(manualRequest.getCategory());
        manual.setStore(store);  // ✅ Store 엔티티 설정

        return new ManualResponse(manualRepository.save(manual));
    }

    // 메뉴얼 삭제
    public void deleteManual(Integer manualId) {
        manualRepository.deleteById(manualId);
    }
}
