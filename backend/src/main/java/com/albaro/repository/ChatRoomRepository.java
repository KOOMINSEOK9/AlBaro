package com.albaro.repository;

import com.albaro.entity.ChatRoom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // 지점별 채팅 내역 조회 (최신순)
    List<ChatRoom> findByStoreIdOrderBySentTimeDesc(Long storeId);

    // 지점별 최근 채팅 내역 조회 (페이징)
    List<ChatRoom> findByStoreIdOrderBySentTimeDesc(Long storeId, Pageable pageable);

    // 특정 시간 이후의 메시지 조회
    @Query("SELECT c FROM ChatRoom c WHERE c.storeId = :storeId AND c.sentTime >= :startTime ORDER BY c.sentTime DESC")
    List<ChatRoom> findRecentMessages(
            @Param("storeId") Long storeId,
            @Param("startTime") LocalDateTime startTime
    );

    // 메시지 개수 조회
    @Query("SELECT COUNT(c) FROM ChatRoom c WHERE c.storeId = :storeId")
    Long countByStoreId(@Param("storeId") Long storeId);

    // 이전 메시지 로드용 (특정 ID보다 이전 메시지)
    @Query("SELECT c FROM ChatRoom c WHERE c.storeId = :storeId AND c.id < :lastMessageId ORDER BY c.sentTime DESC")
    List<ChatRoom> findByStoreIdAndIdLessThanOrderBySentTimeDesc(
        @Param("storeId") Long storeId,
        @Param("lastMessageId") Long lastMessageId,
        Pageable pageable
    );
}