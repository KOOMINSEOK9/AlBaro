package com.albaro.service;

import com.albaro.dto.ManualRequest;
import com.albaro.dto.ManualResponse;
import com.albaro.entity.Manual;
import com.albaro.repository.ManualRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManualService {
    private final ManualRepository manualRepository;

    public ManualService(ManualRepository manualRepository) {
        this.manualRepository = manualRepository;
    }

    // 모든 메뉴얼 조회
    public List<ManualResponse> getAllManuals() {
        List<Manual> manuals = manualRepository.findAll();
        return manuals.stream()
                .map(ManualResponse::new)
                .collect(Collectors.toList());
    }

    // 특정 메뉴얼 조회 (manualId)
    public ManualResponse getManualById(Integer manualId) {
        Manual manual = manualRepository.findById(manualId)
                .orElseThrow(() -> new RuntimeException("Manual not found with id: " + manualId));

        return new ManualResponse(manual);
    }

    // 메뉴얼 생성
    public ManualResponse createManual(ManualRequest manualRequest) {
        Manual manual = manualRequest.toEntity();
        Manual savedManual = manualRepository.save(manual);
        return new ManualResponse(savedManual);
    }

    // 메뉴얼 수정
    public ManualResponse updateManual(Integer manualId, ManualRequest manualRequest) {
        Manual manual = manualRepository.findById(manualId)
                .orElseThrow(() -> new RuntimeException("Manual not found with id: " + manualId));

        manual.setManualName(manualRequest.getManualName());
        manual.setCategory(manualRequest.getCategory());
        manual.setStoreId(manualRequest.getStoreId());

        Manual updatedManual = manualRepository.save(manual);
        return new ManualResponse(updatedManual);
    }

    // 메뉴얼 삭제
    public void deleteManual(Integer manualId) {
        if (!manualRepository.existsById(manualId)) {
            throw new RuntimeException("Manual not found with id: " + manualId);
        }
        manualRepository.deleteById(manualId);
    }
}
