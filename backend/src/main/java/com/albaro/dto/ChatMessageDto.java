package com.albaro.dto;

import java.time.LocalDateTime;

public class ChatMessageDto {
    private Integer storeId;
    private Integer senderId;
    private String content;
    private LocalDateTime sentTime;
    private MessageType type;

    public enum MessageType {
        ENTER, TALK, LEAVE
    }

    // Getters and Setters
    public Integer getStoreId() { return storeId; }
    public void setStoreId(Integer storeId) { this.storeId = storeId; }
    public Integer getSenderId() { return senderId; }
    public void setSenderId(Integer senderId) { this.senderId = senderId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentTime() { return sentTime; }
    public void setSentTime(LocalDateTime sentTime) { this.sentTime = sentTime; }
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
}