package com.albaro.entity;

import jakarta.persistence.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "chatroom")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "chatRoomId")
    private Long id;

    @Column(name = "storeId", nullable = false)
    private Long storeId;

    @Column(name = "userId", nullable = false)
    private Integer userId;

    @Column(name = "content", length = 300)
    @Lob
    private String content;

    @Column(name = "sentTime")
    private LocalDateTime sentTime;

    @Column(name = "userName", columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String userName;

    public ChatRoom() {
    }

    @PrePersist
    public void prePersist() {
        this.sentTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    public static ChatRoom createMessage(Long storeId, Integer userId, String content, String userName) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setStoreId(storeId);
        chatRoom.setUserId(userId);
        chatRoom.setContent(content);
        chatRoom.setUserName(userName);
        return chatRoom;
    }

    // Getters and Setters with encoding
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        try {
            this.content = new String(content.getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8);
        } catch (Exception e) {
            this.content = content;
        }
    }

    public LocalDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(LocalDateTime sentTime) {
        this.sentTime = sentTime;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}