//package com.albaro.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import com.albaro.entity.ChatRoom;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Repository
//public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
//    List<ChatRoom> findByStoreIdOrderBySentTimeDesc(Long storeId);
//}