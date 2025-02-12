package com.albaro.repository;

import com.albaro.entity.ScheduleReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleReferenceRepository extends JpaRepository<ScheduleReference, Integer> {
}
