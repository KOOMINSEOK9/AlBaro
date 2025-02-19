package com.albaro.repository;

import com.albaro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByAccountId(Integer accountId);

    Boolean existsByAccountId(int accountId);

//    User findByAccountId(int accountId);
    @Query("SELECT u.accountId FROM User u WHERE u.id = :userId")
    Integer findAccountIdByUserID(@Param("userId") int userId);

    @Query("SELECT u.accountId FROM User u WHERE u.id = :userId")
    Integer findAccountIdByUserId(@Param("userId") int userId);

    //userId로 storeId찾기
    @Query("SELECT u.store.id FROM User u WHERE u.id = :userId")
    int findStoreIdByUserId(@Param("userId") int userId);

    //storeId로 점장 찾기
    @Query("SELECT u.id FROM User u WHERE u.store.id = :storeId AND u.role = 'MANAGER'")
    Optional<Integer> findManagerIdByStoreId(@Param("storeId") int storeId);

    //mangerId
    @Query("SELECT u.store.id FROM User u WHERE u.id = :managerId AND u.role = 'MANAGER'")
    Optional<Integer> findStoreIdByManagerId(@Param("managerId") int managerId);

    //Username으로 사용자 찾기
    Optional<User> findByUserName(String userName);

    @Query("SELECT u FROM User u WHERE u.store.id = :storeId AND u.role = 'STAFF'")
    Optional<User> findStaffByStoreId(@Param("storeId") int storeId);

}

