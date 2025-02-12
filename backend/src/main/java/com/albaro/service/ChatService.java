//package com.albaro.service;
//
//import org.springframework.stereotype.Service;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import com.albaro.repository.ChatRoomRepository;
//import com.albaro.repository.UserRepository;
//import com.albaro.entity.ChatRoom;
//import com.albaro.dto.ChatMessageDto;
//import com.albaro.entity.User;
//import java.util.List;
//import java.util.stream.Collectors;
//import java.time.LocalDateTime;
//
//@Service
//public class ChatService {
//    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
//
//    private final ChatRoomRepository chatRoomRepository;
//    private final UserRepository userRepository;
//
//    public ChatService(ChatRoomRepository chatRoomRepository,
//                       UserRepository userRepository) {
//        this.chatRoomRepository = chatRoomRepository;
//        this.userRepository = userRepository;
//    }
//
//    public void sendMessage(ChatMessageDto messageDto) {
//        ChatRoom chatRoom = new ChatRoom();
//        chatRoom.setStoreId(messageDto.getStoreId());
//        chatRoom.setSenderId(messageDto.getSenderId());
//        chatRoom.setContent(messageDto.getContent());
//        chatRoom.setSentTime(LocalDateTime.now());
//        chatRoomRepository.save(chatRoom);
//    }
//
//    public List<ChatMessageDto> getChatMessages(Long storeId) {
//        return chatRoomRepository.findByStoreIdOrderBySentTimeDesc(storeId).stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }
//
//    private ChatMessageDto convertToDto(ChatRoom entity) {
//        ChatMessageDto dto = new ChatMessageDto();
//        dto.setId(entity.getId());
//        dto.setStoreId(entity.getStoreId());
//        dto.setSenderId(entity.getSenderId());
//        dto.setContent(entity.getContent());
//        dto.setSentTime(entity.getSentTime());
//
//        User user = userRepository.findById(entity.getSenderId()).orElse(null);
//        String userName = user != null ? user.getUserName() : "Unknown";
//        dto.setSenderName(userName);
//
//        return dto;
//    }
//}
