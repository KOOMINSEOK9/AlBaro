package com.albaro.controller;

import com.albaro.dto.ChatMessageDto;
import com.albaro.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;
import java.util.List;

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

    @GetMapping("/api/chat/store/{storeId}")
    public List<ChatMessageDto> getChatHistory(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "10") int limit) {
        logger.info("Fetching chat history for store: {}, limit: {}", storeId, limit);
        return chatService.getRecentChatHistory(storeId, limit);
    }
}