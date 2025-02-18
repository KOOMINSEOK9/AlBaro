package com.albaro.controller;

import com.albaro.dto.ChatMessageDto;
import com.albaro.entity.ChatRoom;
import com.albaro.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/chat")
//@CrossOrigin
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat/message")
    public void message(@Payload ChatMessageDto message) {
        try {
            chatService.sendMessage(message);
        } catch (Exception e) {
            logger.error("Error processing message: ", e);
            throw e;
        }
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ChatRoom>> getChatHistory(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "100") int limit) {
        try {
            List<ChatRoom> chatHistory = chatService.getRecentChatHistory(storeId, limit);
            return ResponseEntity.ok(chatHistory);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request for chat history: ", e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching chat history: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}