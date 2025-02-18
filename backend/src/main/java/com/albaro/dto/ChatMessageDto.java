package com.albaro.dto;

import com.albaro.entity.ChatRoom;
import java.time.LocalDateTime;

public class ChatMessageDto {
    private Long id;
    private Long storeId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime sentTime;

    public ChatMessageDto() {
    }

    public ChatMessageDto(Long id, Long storeId, Long userId, String userName, String content, LocalDateTime sentTime) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
        this.sentTime = sentTime;
    }

    public boolean isValid() {
        return storeId != null &&
                userId != null &&
                content != null &&
                !content.trim().isEmpty();
    }

    public static ChatMessageDto fromEntity(ChatRoom chatRoom, String userName) {
        return new ChatMessageDto(
                chatRoom.getId(),
                chatRoom.getStoreId(),
                chatRoom.getUserId(),
                userName,
                chatRoom.getContent(),
                chatRoom.getSentTime()
        );
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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