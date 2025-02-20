package com.albaro.controller;

import com.albaro.dto.ChatMessageDto;
import com.albaro.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final ChatService chatService;

    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message) {
        logger.info("Received message in controller: {}", message);
        
        // 메시지 유효성 검사
        if (!message.isValid()) {
            logger.error("Invalid message received: {}", message);
            return;
        }

        // 서비스로 전달
        chatService.sendMessage(message);
    }
}