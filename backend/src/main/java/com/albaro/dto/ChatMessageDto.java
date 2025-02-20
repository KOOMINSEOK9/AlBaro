package com.albaro.dto;

import com.albaro.entity.ChatRoom;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessageDto {
    private Long id;
    private Long storeId;
    private Integer userId;
    private String content;
    private LocalDateTime sentTime;
    private String userName;

    public boolean isValid() {
        return content != null && !content.trim().isEmpty() 
            && userId != null 
            && userName != null 
            && storeId != null;
    }

    public static ChatMessageDto fromEntity(ChatRoom chatRoom) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(chatRoom.getId());
        dto.setStoreId(chatRoom.getStoreId());
        dto.setUserId(chatRoom.getUserId());
        dto.setContent(chatRoom.getContent());
        dto.setSentTime(chatRoom.getSentTime());
        dto.setUserName(chatRoom.getUserName());
        return dto;
    }

    public ChatRoom toEntity() {
        return ChatRoom.createMessage(
            this.storeId,
            this.userId,
            this.content,
            this.userName
        );
    }
}