package com.albaro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {

        corsRegistry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000")
                .allowedOrigins("https://i12b105.p.ssafy.io")

                .allowedMethods("GET", "POST", "PATCH" , "PUT", "DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
                // 웹소켓 관련
//                .allowedHeaders("Upgrade", "Connection", "Sec-WebSocket-Key",
//                              "Sec-WebSocket-Version", "Sec-WebSocket-Extensions",
//                              "Sec-WebSocket-Protocol");
    }
}
