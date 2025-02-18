package com.albaro.service;

import com.albaro.dto.ChatMessageDto;
import com.albaro.entity.ChatRoom;
import com.albaro.repository.ChatRoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessageSendingOperations messagingTemplate;

    public ChatService(ChatRoomRepository chatRoomRepository,
                       SimpMessageSendingOperations messagingTemplate) {
        this.chatRoomRepository = chatRoomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void sendMessage(ChatMessageDto messageDto) {
        if (!messageDto.isValid()) {
            throw new IllegalArgumentException("Invalid message data");
        }

        try {
            // 메시지 저장
            ChatRoom chatRoom = ChatRoom.createMessage(
                    messageDto.getStoreId(),
                    messageDto.getUserId(),
                    messageDto.getContent()
            );
            chatRoomRepository.save(chatRoom);

            // WebSocket으로 메시지 발송
            messageDto.setId(chatRoom.getId());
            messageDto.setSentTime(chatRoom.getSentTime());
            messagingTemplate.convertAndSend("/sub/chat/store/" + messageDto.getStoreId(), messageDto);
        } catch (Exception e) {
            logger.error("Error while sending message: ", e);
            throw new RuntimeException("Failed to send message", e);
        }
    }

    @Transactional(readOnly = true)
    public List<ChatRoom> getChatHistory(Long storeId) {
        validateStoreId(storeId);
        return chatRoomRepository.findByStoreIdOrderBySentTimeDesc(storeId);
    }

    @Transactional(readOnly = true)
    public List<ChatRoom> getRecentChatHistory(Long storeId, int limit) {
        validateStoreId(storeId);
        return chatRoomRepository.findByStoreIdOrderBySentTimeDesc(
                storeId,
                PageRequest.of(0, limit)
        );
    }

    private void validateStoreId(Long storeId) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID cannot be null");
        }
    }
}