package com.albaro.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatRoom")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatRoomId")
    private Long id;

    @Column(name = "storeId", nullable = false)
    private Long storeId;

    @Column(name = "userId", nullable = false)
    private Long userId;

    @Column(name = "content", length = 300)
    private String content;

    @Column(name = "sentTime")
    private LocalDateTime sentTime;

    public ChatRoom() {
    }

    @PrePersist
    public void prePersist() {
        this.sentTime = LocalDateTime.now();
    }

    public static ChatRoom createMessage(Long storeId, Long userId, String content) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setStoreId(storeId);
        chatRoom.setUserId(userId);
        chatRoom.setContent(content);
        return chatRoom;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStoreId() {
        return storeId;
    }

    public void setStoreId(Long storeId) {
        this.storeId = storeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(LocalDateTime sentTime) {
        this.sentTime = sentTime;
    }
}