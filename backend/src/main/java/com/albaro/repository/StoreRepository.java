package com.albaro.repository;

import com.albaro.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Integer> {

    //반경 내 지점 조회(위도/경도 기반으로 거리 계산), 숫자는 1KM 뜻해서 그것만 숫자 바꿔주면 됨 (Native Query 사용)
    @Query(value = "SELECT * FROM store s WHERE " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(s.latitude)))) <= :radius",
            nativeQuery = true)
    List<Store> findNearbyStores(
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radius") double radius);

    //가게 아이디로 가게 이름 찾기
    String findNameByStoreId(int storeId);

}
