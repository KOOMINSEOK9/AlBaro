package com.albaro.repository;

import com.albaro.entity.RefreshEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshRepository extends JpaRepository<RefreshEntity, Long>{

    Boolean existsByRefresh(String refresh);

    @Transactional //트랜잭션 선언해야 함
    void deleteByRefresh(String refresh); //리프레시 토큰 지워주는 메서드

}