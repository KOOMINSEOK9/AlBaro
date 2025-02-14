package com.albaro.service;

import com.albaro.dto.AlarmDto;
import com.albaro.entity.Alarm;
import com.albaro.entity.User;
import com.albaro.repository.AlarmRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AlarmService(AlarmRepository alarmRepository, SimpMessagingTemplate messagingTemplate) {
        this.alarmRepository = alarmRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void insertAlarm(User receiver, String content, Alarm.AlarmType type, Integer senderId) {
        Alarm alarm = new Alarm();
        alarm.setUser(receiver);
        alarm.setAlarmContent(content);
        alarm.setAlarmType(type);
        alarm.setSentTime(LocalDateTime.now());
        alarm.setSenderId(senderId);

        alarmRepository.save(alarm);

        // WebSocket을 이용하여 실시간 알림 전송
        AlarmDto alarmDto = new AlarmDto(alarm.getAlarmId(), receiver.getUserId(), content, type, alarm.getSentTime());
        messagingTemplate.convertAndSend("/topic/alarms", alarmDto);
    }
}
