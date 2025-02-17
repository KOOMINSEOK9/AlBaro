package com.albaro.repository;

import com.albaro.dto.UserDto;
import com.albaro.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
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

    //반경 내 지점 아이디 조회(위도/경도 기반으로 거리 계산), 숫자는 1KM 뜻해서 그것만 숫자 바꿔주면 됨 (Native Query 사용)
    @Query(value = "SELECT s.storeId FROM store s WHERE " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(s.latitude)))) <= :radius",
            nativeQuery = true)
    List<Integer> findNearbyStoreIds(
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radius") double radius);



    //가게 아이디로 정보 가져오기
    Optional<Store> findByStoreId(Integer storeId);

    // StoreRepository에 추가
    @Query("SELECT DISTINCT s FROM Store s " +
            "ORDER BY CASE WHEN s.id = :userStoreId THEN 0 ELSE s.id END")
    List<Store> findAllStoresWithUserStoreFirst(@Param("userStoreId") int userStoreId);

    @Query("SELECT s FROM Store s ORDER BY CASE WHEN s.id = :userStoreId THEN 0 ELSE s.id END")
    List<Store> findAllStoresOrderedByUserStore(@Param("userStoreId") int userStoreId);



}
