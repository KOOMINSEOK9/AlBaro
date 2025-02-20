package com.albaro.controller;

import com.albaro.dto.StoreDto;
import com.albaro.dto.UserDto;
import com.albaro.dto.WorkInformationDto;
import com.albaro.entity.Alarm;
import com.albaro.entity.WorkInformation;
import com.albaro.service.AlarmService;
import com.albaro.service.StoreService;
import com.albaro.service.SubstitutionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/substitute")
public class SubstitutionController {

    private final SubstitutionService substitutionService;
    private final StoreService storeService;
    private final AlarmService alarmService;

    public SubstitutionController(SubstitutionService substitutionService, StoreService storeService, AlarmService alarmService){
        this.substitutionService = substitutionService;
        this.storeService = storeService;
        this.alarmService = alarmService;
    }

    //--------------------알바생 -> 점장( 공석이 있는 지점 찾기)

    //1. 반경 내 지점 리스트 조회 API
    @GetMapping("/nearby-stores")
    public ResponseEntity<?> findNearbyStores(@RequestParam int userId) {
        List<StoreDto> nearbyStores = storeService.findNearbyStores(userId);

        if(nearbyStores == null || nearbyStores.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("주변 지점이 없습니다.");
        }
        return ResponseEntity.ok(nearbyStores);
    }

    //2. 선택한 지점의 공석 확인 API
    @GetMapping("/available-stores")
    public ResponseEntity<?> checkVacantSchedule(
            @RequestParam int storeId) {

        System.out.println(storeId);

        List<WorkInformation> vacantInfo = storeService.checkVacantSchedule(storeId);

        if(vacantInfo == null || vacantInfo.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("해당 시간대에 공석이 없습니다.");
        }

        List<WorkInformationDto> dtoList = vacantInfo.stream()
                .map(WorkInformationDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    //3. 대타 요청 보내기 API
    @PostMapping("/request")
    public ResponseEntity<Void> sendSubstitutionRequest(
            @RequestParam int senderId,
            @RequestParam int storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime){

        substitutionService.sendAdditionSubstitutionRequest(senderId, storeId, workDate, startTime, endTime);
        return ResponseEntity.ok().build();
    }

    //4. 대타 요청 승인 API(알바생 -> 점장)
    @PostMapping("/approve/{alarmId}")
    public ResponseEntity<Void> approveSubstitutionRequest(
            @PathVariable Integer alarmId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate workDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)LocalTime endTime){
        substitutionService.approveAdditionSubstitutionRequest(alarmId, workDate, startTime, endTime);
        alarmService.deleteAlarm(alarmId);  // 수락한 알람 삭제
        return ResponseEntity.ok().build();
    }

    //5. 대타 요청 거절 API
//    @PostMapping("/reject/{alarmId}")
//    public ResponseEntity<Void> rejectSubstitutionRequest(@PathVariable int alarmId){
//        substitutionService.rejectAdditionSubstitutionRequest(alarmId);
//        return ResponseEntity.ok().build();
//    }

    //----------------------점장 -> 알바생(공석 채우기)

    //1. 지점 별 근무 가능한 알바생 조회
    @GetMapping("/available-workers")
    public ResponseEntity<?> findNearbyStoresAndWorkers(@RequestParam Integer storeId) {

        List<UserDto> availableWorkers = storeService.findWorkersInStores(storeId);

        if(availableWorkers.isEmpty() || availableWorkers == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("지점에 근무 가능한 알바생이 없습니다.");
        }
        return ResponseEntity.ok(availableWorkers);
    }


    //2. 점장이 알바생에게 대타 요청하기
    @PostMapping("/managerRequest")
    public ResponseEntity<Void> sendVacantSubstitutionRequest(
            @RequestParam int userId, //로그인 하고 있는 사용자
            @RequestParam String userName, // 대타를 요청 할 알바생 이름
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {

        System.out.println(userId);

        substitutionService.requestSubstitution(userId, userName,
                workDate, startTime, endTime);
        return ResponseEntity.ok().build();
    }

    // 대타 요청 수락
    @PostMapping("/approve-subRequest/{alarmId}")
    public ResponseEntity<Void> approveVacantSubstitutionRequest(
            @PathVariable Integer alarmId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {

        try {

            System.out.println("approve-subRequest: " + alarmId);

            substitutionService.approveVacantSubstitutionRequest(alarmId, workDate, startTime, endTime);
            alarmService.deleteAlarm(alarmId); // 수락한 알람 삭제
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    // 대타 요청 거절
    @PostMapping("/reject-subRequest/{alarmId}")
    public ResponseEntity<Void> rejectSubstitutionRequest(
            @PathVariable Integer alarmId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {
        try {
            substitutionService.rejectSubstitutionRequest(alarmId, workDate, startTime, endTime);
            alarmService.deleteAlarm(alarmId);  // 거절한 알람 삭제
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }


    // -------------------------------(알바생 -> 알바생 대타요청 로직)------------------------------

    // 1. 내/외부 지점 나누어 근무 가능한 알바생 리스트 출력
    @GetMapping("/my-schedule")
    public ResponseEntity<?> findWorkersInNearbyStores(@RequestParam int userId) {
//        Map<String, List<StoreDto>> stores = storeService.findWorkersInNearbyStores(userId);
//
//        if(stores.get("userStore").isEmpty() && stores.get("nearbyStores").isEmpty()) {
//            return ResponseEntity
//                    .status(HttpStatus.NOT_FOUND)
//                    .body("지점이 없습니다.");

        //사용자의 지점(내부 지점) 알바생 리스트 출력
        List<UserDto> workersInUserStore = storeService.findWorkersInUserStore(userId);

        //사용자 지점이 아닌 외부 지점 알바생 리스트 출력
        List<UserDto> workersInExternalStore = storeService.findWorkersInExternalStore(userId);

        if(workersInUserStore.isEmpty() && workersInExternalStore.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("지점이 없습니다.");
        }
        //Map으로 묶이기
        Map<String,List<UserDto>> response = new HashMap<>();
        response.put("internalWorkers", workersInUserStore);
        response.put("externalWorkers", workersInExternalStore);

        return ResponseEntity.ok(response);
    }

    //2. (알바생 -> 알바생) 대타 요청 보내기
    @PostMapping("/workerRequest")
    public ResponseEntity<Void> requestSubstitutionToWorker(
            @RequestParam int userId, //로그인 하고 있는 사용자
            @RequestParam String userName, // 대타를 요청 할 알바생 이름
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {



        substitutionService.requestSubstitution(userId, userName,
                workDate, startTime, endTime);
        return ResponseEntity.ok().build();
    }

    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 자신에게 온 모든 알람 조회
    @GetMapping("/alarms/{userId}")
    public ResponseEntity<List<Alarm>> getAlarmsForUser(@PathVariable Integer userId) {
        List<Alarm> alarms = alarmService.getAlarmsByUserId(userId);
        return ResponseEntity.ok(alarms);
    }

    // 알람 삭제
    @DeleteMapping("/alarms/{alarmId}")
    public ResponseEntity<String> deleteAlarm(@PathVariable Integer alarmId) {
        try {
            substitutionService.deleteAlarm(alarmId);
            return ResponseEntity.ok("알람이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("알람 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
