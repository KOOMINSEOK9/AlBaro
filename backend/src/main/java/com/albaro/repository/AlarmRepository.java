package com.albaro.repository;

import com.albaro.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm,Integer> {

    //특정 유저의 알림 목록 조회
//    List<Alarm> findByUserId(int userId);

    //특정 타입(ex) 대타요청)만 조회
//    List<Alarm> findByUserIdAndAlarmType(int userId, Alarm.AlarmType alarmType);

    //알람 삽입


}
