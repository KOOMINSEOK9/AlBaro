package com.albaro.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import com.albaro.entity.Notification;
import com.albaro.entity.Store;
import com.albaro.entity.User;
import com.albaro.repository.NotificationRepository;
import com.albaro.repository.StoreRepository;
import com.albaro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;


    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Integer id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id: " + id));
    }


    // Store에 있는 공지사항 가져오기
    public List<Notification> getNotificationsByStoreId(Integer storeId) {
        return notificationRepository.findByStore_StoreId(storeId);
    }

    // 🔹 사용자 기반으로 storeId 조회 후 공지사항 작성
    @Transactional
    public Notification createNotificationForUser(Integer userId, Notification notification) {
        // userId에 해당하는 User 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        // 사용자의 storeId 확인
        Store store = user.getStore();
        if (store == null) {
            throw new EntityNotFoundException("User with id " + userId + " is not associated with any store.");
        }

        // store에 공지사항 등록
        notification.setStore(store);
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification updateNotification(Integer id, Notification newNotification) {
        Notification existingNotification = getNotificationById(id);
        existingNotification.setNotificationTitle(newNotification.getNotificationTitle());
        existingNotification.setNotificationContent(newNotification.getNotificationContent());
        return notificationRepository.save(existingNotification);
    }

    @Transactional
    public void deleteNotification(Integer id) {
        notificationRepository.deleteById(id);
    }
}
