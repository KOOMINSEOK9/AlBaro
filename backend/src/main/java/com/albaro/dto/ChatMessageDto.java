package com.albaro.dto;

import com.albaro.entity.ChatRoom;
import java.time.LocalDateTime;

public class ChatMessageDto {
    private Long id;
    private Long storeId;
    private Integer userId;  // Long -> Integer로 변경
    private String userName;
    private String content;
    private LocalDateTime sentTime;

    public ChatMessageDto() {
    }

    public ChatMessageDto(Long id, Long storeId, Integer userId, String userName, String content, LocalDateTime sentTime) {
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

    public static ChatMessageDto fromEntity(ChatRoom chatRoom) {
        return new ChatMessageDto(
                chatRoom.getId(),
                chatRoom.getStoreId(),
                chatRoom.getUserId().intValue(),  // Long -> Integer 변환
                chatRoom.getUserName(),
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
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