package com.albaro.controller;

import com.albaro.dto.FaceRecognitionRequest;
import com.albaro.entity.FaceEmbedding;
import com.albaro.repository.FaceEmbeddingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FaceRecognitionController {

    @Autowired
    private FaceEmbeddingRepository faceEmbeddingRepository;

    @PostMapping("/saveEmbedding")
    public String saveEmbedding(@RequestBody FaceRecognitionRequest request) {
        FaceEmbedding faceEmbedding = new FaceEmbedding();
        faceEmbedding.setUserId(request.getUserId());
        faceEmbedding.setEmbedding(request.getEmbedding());
        faceEmbeddingRepository.save(faceEmbedding);
        return "Embedding saved successfully!";
    }

    @PostMapping("/compareEmbedding")
    public ResponseEntity<String> compareEmbedding(@RequestBody byte[] embedding) {
        List<FaceEmbedding> embeddings = faceEmbeddingRepository.findAll();
        
        double bestScore = Double.MAX_VALUE; // 초기값 설정
        String bestMatchUserId = null;

        for (FaceEmbedding faceEmbedding : embeddings) {
            double score = calculateSimilarity(faceEmbedding.getEmbedding(), embedding);
            
            if (score < bestScore) { // 낮은 점수가 더 좋은 매칭을 의미
                bestScore = score;
                bestMatchUserId = faceEmbedding.getUserId();
            }
        }

        if (bestMatchUserId != null) {
            return ResponseEntity.ok("Best match: " + bestMatchUserId + " with score: " + bestScore);
        } else {
            return ResponseEntity.ok("No match found.");
        }
    }

    /** 
     * 유사도 계산 메서드
      사용하는 모델인 InceptionResnetV1 에서는 
      원본 FaceNet 모델이 임베딩 벡터 간의 유클리드 거리를 최소화하도록 학습되었기 때문에
      유클리드 거리를 사용하여 유사도를 계산하는 방법으로 구현했습니다.
     * */ 
    private double calculateSimilarity(byte[] storedEmbedding, byte[] incomingEmbedding) {
        double sum = 0.0;
        for (int i = 0; i < storedEmbedding.length; i++) {
            double diff = storedEmbedding[i] - incomingEmbedding[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum); // 유클리드 거리 반환
    }
}