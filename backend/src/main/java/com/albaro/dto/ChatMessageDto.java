package com.albaro.dto;

import java.time.LocalDateTime;

public class ChatMessageDto {
    private Long id;
    private Long storeId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime sentTime;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getSentTime() { return sentTime; }
    public void setSentTime(LocalDateTime sentTime) { this.sentTime = sentTime; }
}