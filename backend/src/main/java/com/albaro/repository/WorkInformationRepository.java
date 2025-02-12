package com.albaro.repository;

import com.albaro.entity.WorkInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkInformationRepository extends JpaRepository<WorkInformation, Integer> {
    List<WorkInformation> findByStoreId(Integer storeId);
}
