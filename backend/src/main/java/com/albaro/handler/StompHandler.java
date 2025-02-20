package com.albaro.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 연결 시도 로그
            System.out.println("New WebSocket Connection");
        } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            // 구독 로그
            System.out.println("New subscription to: " + accessor.getDestination());
        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            // 연결 종료 로그
            System.out.println("WebSocket Connection Closed");
        }
        
        return message;
    }
}