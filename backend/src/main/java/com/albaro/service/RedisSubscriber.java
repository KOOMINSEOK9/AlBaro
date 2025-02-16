package com.albaro.service;

import com.albaro.dto.ChatMessageDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class RedisSubscriber implements MessageListener {
    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    public RedisSubscriber(ObjectMapper objectMapper,
                           RedisTemplate<String, Object> redisTemplate,
                           SimpMessageSendingOperations messagingTemplate) {
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String publishMessage = redisTemplate.getStringSerializer().deserialize(message.getBody());
            ChatMessageDto chatMessage = objectMapper.readValue(publishMessage, ChatMessageDto.class);
            messagingTemplate.convertAndSend("/sub/chat/store/" + chatMessage.getStoreId(), chatMessage);
        } catch (Exception e) {
            System.out.println("Error while parsing chat message: " + e.getMessage());
        }
    }
}