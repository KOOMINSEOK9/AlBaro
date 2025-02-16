// package com.albaro.controller;

// import com.albaro.dto.ChatMessageDto;
// import com.albaro.entity.ChatRoom;
// import com.albaro.service.ChatService;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;

// @RestController
// @RequestMapping("/chat")
// @CrossOrigin(origins = "*")
// public class ChatController {
//     private final ChatService chatService;

//     public ChatController(ChatService chatService) {
//         this.chatService = chatService;
//     }

//     @MessageMapping("/chat/message")
//     public void message(@Payload ChatMessageDto message) {
//         chatService.sendMessage(message);
//     }

//     @GetMapping("/store/{storeId}")
//     public List<ChatRoom> getChatHistory(@PathVariable Integer storeId) {
//         return chatService.getChatHistory(storeId);
//     }
// }