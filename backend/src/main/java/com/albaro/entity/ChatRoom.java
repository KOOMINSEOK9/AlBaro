package com.albaro.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatRoom")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer chatRoomId;

    @Column(nullable = false)
    private Integer storeId;

    @Column(nullable = false)
    private Integer senderId;

    @Column(length = 300)
    private String content;

    private LocalDateTime sentTime;

    // Getters and Setters
    public Integer getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(Integer chatRoomId) { this.chatRoomId = chatRoomId; }
    public Integer getStoreId() { return storeId; }
    public void setStoreId(Integer storeId) { this.storeId = storeId; }
    public Integer getSenderId() { return senderId; }
    public void setSenderId(Integer senderId) { this.senderId = senderId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentTime() { return sentTime; }
    public void setSentTime(LocalDateTime sentTime) { this.sentTime = sentTime; }
}