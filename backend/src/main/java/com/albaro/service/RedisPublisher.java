// package com.albaro.service;

// import com.albaro.dto.ChatMessageDto;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.data.redis.listener.ChannelTopic;
// import org.springframework.stereotype.Service;

// @Service
// public class RedisPublisher {
//     private final RedisTemplate<String, Object> redisTemplate;

//     public RedisPublisher(RedisTemplate<String, Object> redisTemplate) {
//         this.redisTemplate = redisTemplate;
//     }

//     public void publish(ChannelTopic topic, ChatMessageDto message) {
//         redisTemplate.convertAndSend(topic.getTopic(), message);
//     }
// }