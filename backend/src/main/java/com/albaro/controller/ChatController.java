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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
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
    @ResponseBody
    public List<ChatMessageDto> getChatHistory(
        @PathVariable Long storeId,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(required = false) Long lastMessageId  // 마지막으로 받은 메시지 ID
    ) {
        logger.info("Fetching chat history for store: {}, limit: {}, lastMessageId: {}", 
            storeId, limit, lastMessageId);
        return chatService.getRecentChatHistory(storeId, limit, lastMessageId);
    }
}