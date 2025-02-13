package com.albaro.controller;

import com.albaro.dto.AlarmDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
//import com.albaro.service.ChatService;
//import com.albaro.dto.ChatMessageDto;
import java.util.List;

@Controller
public class WebSocketController {

//    private final ChatService chatService;
//    private final SimpMessageSendingOperations messagingTemplate;

//    public WebSocketController(ChatService chatService, SimpMessageSendingOperations messagingTemplate) {
//        this.chatService = chatService;
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    @MessageMapping("/chat.send")
//    public void sendMessage(@Payload ChatMessageDto message) {
//        chatService.sendMessage(message);
//        messagingTemplate.convertAndSend("/topic/store." + message.getStoreId(), message);
//    }
//
//    @GetMapping("/api/chat/{storeId}")
//    @ResponseBody
//    public List<ChatMessageDto> getChatHistory(@PathVariable Long storeId) {
//        return chatService.getChatMessages(storeId);
//    }

    @MessageMapping("/sendSubRequest")
    @SendTo("/topic/alarms")
    public AlarmDto sendNotification(AlarmDto alarmDto) {
        return alarmDto;
    }

}
