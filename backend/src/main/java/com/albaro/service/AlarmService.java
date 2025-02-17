package com.albaro.service;

import com.albaro.entity.Alarm;
import com.albaro.entity.User;
import com.albaro.repository.AlarmRepository;
import com.albaro.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlarmService {

    private final AlarmRepository alarmRepository;
//    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public AlarmService(AlarmRepository alarmRepository, SimpMessagingTemplate messagingTemplate, UserRepository userRepository) {
        this.alarmRepository = alarmRepository;
//        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 웹 소켓 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
//    @Transactional
//    public void insertAlarm(User receiver, String content, Alarm.AlarmType type, Integer senderId) {
//        Alarm alarm = new Alarm();
//        alarm.setUser(receiver);
//        alarm.setAlarmContent(content);
//        alarm.setAlarmType(type);
//        alarm.setSentTime(LocalDateTime.now());
//        alarm.setSenderId(senderId);
//
//        alarmRepository.save(alarm);
//
//        // WebSocket을 이용하여 실시간 알림 전송
//        AlarmDto alarmDto = new AlarmDto(alarm.getAlarmId(), receiver.getUserId(), content, type, alarm.getSentTime());
//        messagingTemplate.convertAndSend("/topic/alarms", alarmDto);
//    }

    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 기능 구현 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 본인 알람 가져오기
    public List<Alarm> getAlarmsByUserId(Integer userId) {

        return alarmRepository.findByUser_UserId(userId);
    }

    public void deleteAlarm(int alarmId) {
        alarmRepository.deleteById(alarmId);
    }

    // 대타 요청을 수신자가 승인, 거절하면 발신자에게 알람 보내기
//    public void processSubstitutionApproval(Integer alarmId, boolean isApproved) {
//        // 알람 조회
//        Alarm alarm = alarmRepository.findById(alarmId).orElseThrow(() -> new IllegalArgumentException("Invalid alarm ID"));
//
//        // 수신자가 대타 요청을 승인했는지, 거절했는지에 대한 처리
//        if (alarm.getAlarmType() == Alarm.AlarmType.SUBSTITUTION_REQUEST) {
//            // 발신자에게 알람 보내기
//            Alarm senderAlarm = new Alarm();
//            senderAlarm.setUser(alarm.getSender()); // 발신자에게 알람
//            senderAlarm.setSender(alarm.getUser()); // 수신자 설정
//            senderAlarm.setAlarmContent(isApproved ? "대타 요청이 승인되었습니다." : "대타 요청이 거절되었습니다.");
//            senderAlarm.setAlarmType(isApproved ? Alarm.AlarmType.SUBSTITUTION_APPROVAL : Alarm.AlarmType.SUBSTITUTION_REJECT);
//            senderAlarm.setSentTime(LocalDateTime.now());
//            senderAlarm.setAlarmStatus(Alarm.AlarmStatus.WAIT);
//
//            // 알람 저장
//            alarmRepository.save(senderAlarm);
//
//            // 수신자 알람 상태 업데이트
//            alarm.setAlarmStatus(isApproved ? Alarm.AlarmStatus.APPROVE : Alarm.AlarmStatus.REJECT);
//            alarmRepository.save(alarm);
//        }
//    }
}
