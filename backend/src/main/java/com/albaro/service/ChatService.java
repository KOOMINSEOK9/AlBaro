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
            throw new IllegalArgumentException("Invalid message data");
        }

        try {
            User user = userRepository.findById(messageDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            messageDto.setUserName(user.getUserName());

            logger.debug("Received message data: {}", messageDto);

            ChatRoom chatRoom = ChatRoom.createMessage(
                    messageDto.getStoreId(),
                    messageDto.getUserId(),
                    messageDto.getContent(),
                    user.getUserName()
            );

            chatRoomRepository.save(chatRoom);

            messageDto.setId(chatRoom.getId());
            messageDto.setSentTime(chatRoom.getSentTime());

            logger.debug("Sending message. UserName: {}, Content: {}",
                    messageDto.getUserName(), messageDto.getContent());

            messagingTemplate.convertAndSend("/sub/chat/store/" + messageDto.getStoreId(), messageDto);
        } catch (Exception e) {
            logger.error("Error while sending message: ", e);
            throw new RuntimeException("Failed to send message", e);
        }
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getRecentChatHistory(Long storeId, int limit) {
        validateStoreId(storeId);
        List<ChatRoom> chatRooms = chatRoomRepository.findByStoreIdOrderBySentTimeDesc(
                storeId,
                PageRequest.of(0, limit)
        );

        return chatRooms.stream()
                .map(chatRoom -> {
                    ChatMessageDto dto = ChatMessageDto.fromEntity(chatRoom);
                    userRepository.findById(chatRoom.getUserId())
                            .ifPresent(user -> {
                                String userName = new String(user.getUserName().getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8);
                                dto.setUserName(userName);
                            });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private void validateStoreId(Long storeId) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID cannot be null");
        }
    }
}