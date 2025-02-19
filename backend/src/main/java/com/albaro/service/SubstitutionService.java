package com.albaro.service;

import com.albaro.entity.Alarm;
import com.albaro.entity.User;
import com.albaro.entity.WorkInformation;
import com.albaro.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class SubstitutionService {

    private final AlarmRepository alarmRepository;
    private final UserRepository userRepository;
    private final WorkInformationRepository workInformationRepository;
    private final StoreRepository storeRepository;

    public SubstitutionService(AlarmRepository alarmRepository, UserRepository userRepository, WorkInformationRepository workInformationRepository, StoreRepository storeRepository){
        this.alarmRepository = alarmRepository;
        this.userRepository = userRepository;
        this.workInformationRepository = workInformationRepository;
        this.storeRepository = storeRepository;
    }

    //------------------ 알바생 -> 지점 근무 요청 --------------------

    //대타 요청 보내기(알바생 -> 지점의 점장, AdditionSubstitutionRequest)
    @Transactional
    public void sendAdditionSubstitutionRequest(int senderId, int storeId, LocalDate workDate, LocalTime startTime, LocalTime endTime) {
        //sender: 알바생, receiver: 점장
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("보낸 사람을 찾을 수 없음"));

        //점장 userId 찾기
        int receiverId = userRepository.findManagerIdByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("매장에 등록된 점장을 찾을 수 없습니다."));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("받은 사람을 찾을 수 없음"));

        String content = String.format("대타 요청: %s님이 %d번 매장의 %s %s~%s 시간대에 근무 승인을 요청했습니다.",
                sender.getUserName(),
                storeId,
                workDate,
                startTime,
                endTime
        );

        //알림 전송
        insertAlarm(receiver, content, Alarm.AlarmType.MANAGER_APPROVAL, senderId);
//        Alarm alarm = new Alarm();
//        alarm.setUser(receiver); //받는 사람 유저 idx
//        alarm.setAlarmContent(content);
//        alarm.setAlarmType(Alarm.AlarmType.MANAGER_APPROVAL); //점장 승인 알람
//        alarm.setSentTime(LocalDateTime.now());
//        alarm.setSenderId(senderId)
    }

    //대타 요청 승인(알바생-> 지점 로직, 점장이 승인)
    //sender: 알바생, receiver: 점장
    @Transactional
    public void approveAdditionSubstitutionRequest(int alarmId, LocalDate workDate, LocalTime startTime, LocalTime endTime){
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(()-> new RuntimeException("알림이 없습니다."));

        User sender = userRepository.findById(alarm.getSenderId())
                .orElseThrow(() -> new RuntimeException("보낸 사용자를 찾을 수 없음"));


        User receiver = alarm.getUser();

//        WorkInformation workInformation = new WorkInformation();

//        workInformation.setRealTimeWorker(sender.getAccountId()); //보낸 사람이 일 할 사람
//        workInformation.setVacant(false); // 공석 여부 false로 변환
//        workInformation.setWorkDate(workDate);
//        workInformation.setStartTime(startTime);
//        workInformation.setEndTime(endTime);
//        workInformation.setStore(sender.getStore());
//        workInformation.setUser(sender);
//
//        workInformationRepository.save(workInformation);

        //새로운 근무 정보 업데이트
        workInformationRepository.updateWorkerAndVacantStatus(sender.getAccountId(), workDate, receiver.getStore().getStoreId(), startTime,endTime);

        //대타 요청 수락 알림 전송 -> 근무할 알바생에게!
        insertAlarm(sender, "대타 요청이 승인되었습니다.", Alarm.AlarmType.SUBSTITUTION_APPROVAL, null);
    }

    //대타 요청 거절 알림
    @Transactional
    public void rejectAdditionSubstitutionRequest(int alarmId) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("대타 요청 알림을 찾을 수 없음"));

        User sender = userRepository.findById(alarm.getSenderId())
                .orElseThrow(() -> new RuntimeException("보낸 사용자를 찾을 수 없음"));

        // 대타 요청 거절 알림 전송
        Alarm rejectionAlarm = new Alarm();
        rejectionAlarm.setUser(sender);
        rejectionAlarm.setAlarmContent("대타 요청이 거절되었습니다.");
        rejectionAlarm.setAlarmType(Alarm.AlarmType.SUBSTITUTION_REJECT);
        rejectionAlarm.setSentTime(LocalDateTime.now());

        alarmRepository.save(rejectionAlarm);
    }

    //------------------ 점장 -> 알바생 근무 요청 --------------------

    // 점장이 알바생에게 대타 요청 + 알림 전송(VacantSubstitutionRequest)
    @Transactional
    public void sendVacantSubstitutionRequest(int userId, String userName, LocalDate workDate, LocalTime startTime, LocalTime endTime) {

        // 점장 정보 확인 -> userId: 로그인 한 사용자
        User manager = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("점장 정보를 찾을 수 없습니다."));

        // 알바생 정보 확인
        User worker = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("알바생 정보를 찾을 수 없습니다."));

        // 알림 내용 생성
        String content = String.format("%s의 점장님이 %s %s~%s에 대타 근무를 요청했습니다.",
                manager.getStore().getStoreName(),
                workDate,
                startTime,
                endTime
        );

        // 알림 생성
        insertAlarm(worker, content, Alarm.AlarmType.SUBSTITUTION_REQUEST,userId);
    }

    //알바생 근무 수락 시 일정 반영
    @Transactional
    public void approveVacantSubstitutionRequest(int alarmId, LocalDate workDate, LocalTime startTime, LocalTime endTime) {

        // 알람 조회
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("알람을 찾을 수 없습니다."));

        // 알바생(수락한 사람) 정보 조회
        User worker = userRepository.findById(alarm.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("알바생 정보를 찾을 수 없습니다."));

        // 점장(요청한 사람) 정보 조회
        User manager = userRepository.findById(alarm.getSenderId())
                .orElseThrow(() -> new RuntimeException("점장 정보를 찾을 수 없습니다."));

//        // WorkInformation에 근무 정보 저장
//        WorkInformation workInformation = new WorkInformation();
//        workInformation.setUser(manager);
//        workInformation.setStore(manager.getStore());
//        workInformation.setWorkDate(workDate);
//        workInformation.setStartTime(startTime);
//        workInformation.setEndTime(endTime);
//        workInformation.setVacant(false);  // 공석 아님으로 설정
//        workInformation.setRealTimeWorker(worker.getUserId());
//
//        workInformationRepository.save(workInformation);

        //WorkInformation 근무 정보 수정
        workInformationRepository.updateWorkerAndVacantStatus(worker.getAccountId(), workDate, manager.getStore().getStoreId(), startTime,endTime);


        // 점장에게 수락 알림 보내기
        String managerContent = String.format("%s님이 %s일 %s~%s 대타 근무를 수락하였습니다.",
                worker.getUserName(),
                workDate,
                startTime,
                endTime);

        System.out.println("아무튼 알바생 정보:"+worker);

        insertAlarm(manager, managerContent, Alarm.AlarmType.SUBSTITUTION_APPROVAL, alarm.getUser().getUserId());
    }

    //대타 요청 거절 알림(알바생이 점장 요청 거절했을 때)
    @Transactional
    public void rejectSubstitutionRequest(Integer alarmId, LocalDate workDate, LocalTime startTime, LocalTime endTime) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("대타 요청 알림을 찾을 수 없음"));

        User sender = userRepository.findById(alarm.getSenderId())
                .orElseThrow(() -> new RuntimeException("보낸 사용자를 찾을 수 없음"));

        User worker = alarm.getUser(); // 대타 요청을 받은 알바생

        // 대타 요청 거절 알림 전송
        String alarmContent = String.format("%s님이 %s일 %s~%s 대타 근무를 거절하였습니다.",
                worker.getUserName(),
                workDate,
                startTime,
                endTime);

        Alarm rejectionAlarm = new Alarm();
        rejectionAlarm.setUser(sender); // 점장에게 알림 전송
        rejectionAlarm.setAlarmContent(alarmContent);
        rejectionAlarm.setAlarmType(Alarm.AlarmType.SUBSTITUTION_REJECT);
        rejectionAlarm.setSentTime(LocalDateTime.now());

        alarmRepository.save(rejectionAlarm);
    }


    // ----------------------------((알바생 -> 알바생) 대타요청 로직)-----------------------------

    // 점장이 알바생에게 대타 요청 + 알림 전송
    @Transactional
    public void requestSubstitution(int userId, String userName, LocalDate workDate, LocalTime startTime, LocalTime endTime) {

        // 알바생 정보 확인 -> userId: 로그인 한 알바생
        User requestWorker = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("점장 정보를 찾을 수 없습니다."));

        // 알바생 정보 확인
        User worker = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("알바생 정보를 찾을 수 없습니다."));

        // 알림 내용 생성
        String content = String.format("%s의 %s님이 %s %s~%s에 대타 근무를 요청했습니다.",
                requestWorker.getStore().getStoreName(),
                requestWorker.getUserName(),
                workDate,
                startTime,
                endTime
        );

        // 알림 생성
        insertAlarm(worker, content, Alarm.AlarmType.SUBSTITUTION_REQUEST,userId);
    }

    //알바생 근무 수락 시 일정 반영
    @Transactional
    public void approveSubstitutionRequest(int alarmId, LocalDate workDate, LocalTime startTime, LocalTime endTime) {

        // 알람 조회
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("알람을 찾을 수 없습니다."));

        // 알바생(수락한 사람) 정보 조회
        User worker = userRepository.findById(alarm.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("알바생 정보를 찾을 수 없습니다."));

        // 알바생(요청한 사람) 정보 조회
        User requestWorker = userRepository.findById(alarm.getSenderId())
                .orElseThrow(() -> new RuntimeException("알바생 정보를 찾을 수 없습니다."));

//        // WorkInformation에 근무 정보 저장
//        WorkInformation workInformation = new WorkInformation();
//        workInformation.setUser(requestWorker);
//        workInformation.setStore(requestWorker.getStore());
//        workInformation.setWorkDate(workDate);
//        workInformation.setStartTime(startTime);
//        workInformation.setEndTime(endTime);
//        workInformation.setVacant(false);  // 공석 아님으로 설정
//        workInformation.setRealTimeWorker(worker.getUserId());
//
//        workInformationRepository.save(workInformation);

       //WorkInformation 근무 정보 수정
        workInformationRepository.updateWorkerAndVacantStatus(worker.getUserId(), workDate, requestWorker.getStore().getStoreId(), startTime,endTime);


        //가게이름으로 점장아이디 찾기
        int managerId = userRepository.findManagerIdByStoreId(requestWorker.getStore().getStoreId())
                .orElseThrow(()-> new RuntimeException("해당하는 점장Id을 찾을 수 없습니다."));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("해당하는 점장을 찾을 수 없습니다."));

        // 점장에게 스케줄 변경 알림 보내기
        String managerContent = String.format("%s님의 근무일정(%s일 %s~%s)에 %s의 %s님이 대신 근무합니다.",
                requestWorker.getUserName(),
                workDate,
                startTime,
                endTime,
                worker.getStore().getStoreName(),
                worker.getUserName());

        insertAlarm(manager, managerContent, Alarm.AlarmType.SCHEDULE_UPDATE, requestWorker.getUserId());

        //요청자에게 대타 요청 수락 알림 보내기
        String workerContent = String.format("%s님이 %s %s~%s 대타 근무를 요청을 수락했습니다.",
                worker.getUserName(),
                workDate,
                startTime,
                endTime);

        insertAlarm(requestWorker, workerContent, Alarm.AlarmType.SUBSTITUTION_APPROVAL, worker.getUserId());

    }

    // 알람 삭제
    @Transactional
    public void deleteAlarm(Integer alarmId) {
        if (!alarmRepository.existsById(alarmId)) {
            throw new IllegalArgumentException("알람이 존재하지 않습니다: " + alarmId);
        }
        alarmRepository.deleteById(alarmId);
    }
    //대타 요청 거절 알림(알바생이 대타 요청 거절했을 때)
//    @Transactional
//    public void rejectSubstitutionRequest(int alarmId) {
//        Alarm alarm = alarmRepository.findById(alarmId)
//                .orElseThrow(() -> new RuntimeException("대타 요청 알림을 찾을 수 없음"));
//
//        User sender = userRepository.findById(alarm.getSenderId())
//                .orElseThrow(() -> new RuntimeException("보낸 사용자를 찾을 수 없음"));
//
//        // 대타 요청 거절 알림 전송
//        insertAlarm(sender,"대타 요청이 거절되었습니다.", Alarm.AlarmType.SUBSTITUTION_REJECT,null);
//
//    }




    //알람 저장하는 메서드(알람 전송)
    //user: 알림 받는 사람
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void insertAlarm(User user, String alarmContent, Alarm.AlarmType alarmType, Integer senderId) {
        Alarm alarm = new Alarm();
        alarm.setUser(user);
        alarm.setAlarmContent(alarmContent);
        alarm.setAlarmType(alarmType);
        alarm.setSenderId(senderId);
        alarm.setSentTime(LocalDateTime.now());
        alarmRepository.save(alarm);
    }

}
