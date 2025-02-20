package com.albaro.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDto {
    private String content;
    private Long userId;
    private String userName;
    private Long storeId;
    private String sentTime;
}