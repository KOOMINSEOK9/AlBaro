package com.albaro.controller;

import com.albaro.dto.ChatMessageDto;
import com.albaro.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat/message")
    public void message(@Payload ChatMessageDto message) throws UnsupportedEncodingException {
        try {
            // URL 디코딩 추가
            message.setContent(URLDecoder.decode(message.getContent(), StandardCharsets.UTF_8.toString()));
            chatService.sendMessage(message);
        } catch (UnsupportedEncodingException e) {
            logger.error("Error decoding message content: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error processing message: ", e);
            throw new RuntimeException("Failed to process message", e);
        }
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "100") int limit) {
        try {
            List<ChatMessageDto> chatHistory = chatService.getRecentChatHistory(storeId, limit);
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