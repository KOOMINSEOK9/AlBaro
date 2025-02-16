package com.albaro.service;

import com.albaro.dto.ChatMessageDto;
import com.albaro.entity.ChatRoom;
import com.albaro.repository.ChatRoomRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    private final ChannelTopic channelTopic;
    private final RedisPublisher redisPublisher;
    private final ChatRoomRepository chatRoomRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public ChatService(RedisPublisher redisPublisher,
                       ChatRoomRepository chatRoomRepository,
                       RedisTemplate<String, Object> redisTemplate) {
        this.channelTopic = new ChannelTopic("chatroom");
        this.redisPublisher = redisPublisher;
        this.chatRoomRepository = chatRoomRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public void sendMessage(ChatMessageDto messageDto) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setStoreId(messageDto.getStoreId());
        chatRoom.setSenderId(messageDto.getSenderId());
        chatRoom.setContent(messageDto.getContent());
        chatRoom.setSentTime(LocalDateTime.now());

        chatRoomRepository.save(chatRoom);
        redisPublisher.publish(channelTopic, messageDto);
    }

    @Transactional(readOnly = true)
    public List<ChatRoom> getChatHistory(Integer storeId) {
        return chatRoomRepository.findByStoreId(storeId);
    }
}
