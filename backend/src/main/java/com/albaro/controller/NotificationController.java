package com.albaro.controller;

import com.albaro.entity.Notification;
import com.albaro.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // DB에 저장된 모든 공지 사항 가져오기
    @GetMapping
    public List<Notification> getAllNotifications() {
        return service.getAllNotifications();
    }

    // 지점별 공지 가져오기
    @GetMapping("store/{storeId}")
    public ResponseEntity<List<Notification>> getNotificationsByStoreId(@PathVariable Integer storeId){
        List<Notification> notifications = service.getNotificationsByStoreId(storeId);
        return ResponseEntity.ok(notifications);
    }

    // 게시글 정보 가져오기
    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Integer notificationId) {
        // service.getNotificationById(id)가 예외를 던지면 @ResponseStatus에 의해 404가 자동 반환됩니다.
        Notification notification = service.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }

    // 사용자의 storeId에 공지사항 작성
    @PostMapping("/{userId}")
    public ResponseEntity<Notification> createNotificationForUser(@PathVariable Integer userId,
                                                                  @RequestBody Notification notification) {
        Notification createdNotification = service.createNotificationForUser(userId, notification);
        return ResponseEntity.ok(createdNotification);
    }

    // 공지 수정
    @PutMapping("/{notificationId}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Integer notificationId, @RequestBody Notification newNotification) {
        Notification updatedNotification = service.updateNotification(notificationId, newNotification);
        return ResponseEntity.ok(updatedNotification);
    }

    // 공지 삭제
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Integer notificationId) {
        service.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
}
