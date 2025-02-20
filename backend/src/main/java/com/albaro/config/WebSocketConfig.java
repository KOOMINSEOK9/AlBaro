package com.albaro.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.TaskScheduler;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Bean
    public TaskScheduler messageBrokerTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1);
        scheduler.setThreadNamePrefix("wss-heartbeat-thread-");
        scheduler.setDaemon(true);
        return scheduler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                    "https://i12b105.p.ssafy.io",
                    "http://i12b105.p.ssafy.io"
                )
                .withSockJS()
                .setWebSocketEnabled(true)       // WebSocket 활성화 명시적 설정
                .setHeartbeatTime(25000)        // 하트비트 시간 설정
                .setDisconnectDelay(5000);      // 연결 해제 지연 시간
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub")
              .setHeartbeatValue(new long[]{10000, 10000})
              .setTaskScheduler(messageBrokerTaskScheduler()); // TaskScheduler 설정 추가
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(64 * 1024)
                .setSendBufferSizeLimit(512 * 1024)
                .setSendTimeLimit(20000)
                .setTimeToFirstMessage(30000);   // 첫 메시지 대기 시간 설정
    }


    
    // ... 나머지 코드는 동일 ...
}