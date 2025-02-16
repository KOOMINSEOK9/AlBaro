package com.albaro.repository;

import com.albaro.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    List<ChatRoom> findByStoreId(Integer storeId);
}