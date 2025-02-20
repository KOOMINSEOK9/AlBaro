package com.albaro.controller;

import com.albaro.dto.ChatMessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message) {
        // 특정 storeId를 가진 채팅방으로 메시지 전송
        messagingTemplate.convertAndSend(
            "/sub/chat/room/" + message.getStoreId(), 
            message
        );
    }
}