package com.albaro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // @Override
    // public void registerStompEndpoints(StompEndpointRegistry registry) {
    //     registry.addEndpoint("/ws-stomp")
    //             .setAllowedOriginPatterns("*")  // 개발 중에는 모든 origin 허용
    //             .withSockJS()
    //             .setClientLibraryUrl("https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js")
    //             .setWebSocketEnabled(true)
    //             .setSessionCookieNeeded(false);
    // }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp")
                .setAllowedOrigins("*")
                .withSockJS()
                .setInterceptors(new HttpSessionHandshakeInterceptor())  // 세션 인터셉터 추가
                .setWebSocketEnabled(true)  // WebSocket 명시적 활성화
                .setSessionCookieNeeded(false); // 세션 쿠키 비활성화
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub");
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(128 * 1024)
                   .setSendBufferSizeLimit(512 * 1024)
                   .setSendTimeLimit(20000);
    }


}