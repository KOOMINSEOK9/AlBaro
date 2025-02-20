package com.albaro.service;

import com.albaro.dto.ChatMessageDto;
import com.albaro.entity.ChatRoom;
import com.albaro.entity.User;
import com.albaro.repository.ChatRoomRepository;
import com.albaro.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final SimpMessageSendingOperations messagingTemplate;

    public ChatService(ChatRoomRepository chatRoomRepository,
                       UserRepository userRepository,
                       SimpMessageSendingOperations messagingTemplate) {
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void sendMessage(ChatMessageDto messageDto) {
        if (!messageDto.isValid()) {
            logger.error("Invalid message data: {}", messageDto);
            throw new IllegalArgumentException("Invalid message data");
        }

        try {
            User user = userRepository.findById(messageDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            messageDto.setUserName(user.getUserName());

            logger.info("Creating chat message with data - storeId: {}, userId: {}, userName: {}, content: {}", 
                messageDto.getStoreId(), messageDto.getUserId(), user.getUserName(), messageDto.getContent());

            ChatRoom chatRoom = ChatRoom.createMessage(
                    messageDto.getStoreId(),
                    messageDto.getUserId(),
                    messageDto.getContent(),
                    user.getUserName()
            );

            ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
            logger.info("Successfully saved chat message with id: {}", savedChatRoom.getId());

            messageDto.setId(chatRoom.getId());
            messageDto.setSentTime(chatRoom.getSentTime());

            logger.info("Sending message to WebSocket. MessageDto: {}", messageDto);

            messagingTemplate.convertAndSend("/sub/chat/room/" + messageDto.getStoreId(), messageDto);
        } catch (Exception e) {
            logger.error("Error while sending message: ", e);
            throw new RuntimeException("Failed to send message", e);
        }
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getRecentChatHistory(Long storeId, int limit, Long lastMessageId) {
        validateStoreId(storeId);
        
        List<ChatRoom> chatRooms;
        if (lastMessageId == null) {
            // 첫 로드
            chatRooms = chatRoomRepository.findByStoreIdOrderBySentTimeDesc(
                storeId,
                PageRequest.of(0, limit)
            );
        } else {
            // 이전 메시지 로드
            chatRooms = chatRoomRepository.findByStoreIdAndIdLessThanOrderBySentTimeDesc(
                storeId,
                lastMessageId,
                PageRequest.of(0, limit)
            );
        }

        return chatRooms.stream()
                .map(ChatMessageDto::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateStoreId(Long storeId) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID cannot be null");
        }
    }
}
