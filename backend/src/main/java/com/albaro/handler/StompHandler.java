package com.albaro.handler;

import com.albaro.jwt.JWTUtil;  // JWTUtil로 수정
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JWTUtil jwtUtil;  // JWTUtil 사용

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                // JWT 토큰 검증
                if (!jwtUtil.isExpired(token)) {  // JWTUtil의 메서드 사용
                    // 인증 성공 - 사용자 정보 설정
                    String username = jwtUtil.getUsername(token);
                    String role = jwtUtil.getRole(token);
                    Integer accountId = jwtUtil.getAccountId(token);
                    accessor.setUser(() -> username); // 간단히 username만 설정
                }
            }
        }
        return message;
    }
}