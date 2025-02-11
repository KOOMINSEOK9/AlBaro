package com.albaro.repository;

import com.albaro.entity.Manual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManualRepository extends JpaRepository<Manual, Integer> {
}
