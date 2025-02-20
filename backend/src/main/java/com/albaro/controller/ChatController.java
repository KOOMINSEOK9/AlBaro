package com.albaro.controller;

import com.albaro.dto.ChatMessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat/message")
    @SendTo("/sub/chat/room/{storeId}")
    public ChatMessageDto message(ChatMessageDto message) {
        return message;
    }
}