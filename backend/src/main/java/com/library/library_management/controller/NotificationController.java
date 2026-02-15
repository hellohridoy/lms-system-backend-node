package com.library.library_management.controller;

import com.library.library_management.model.User;
import com.library.library_management.model.UserNotification;
import com.library.library_management.repository.UserNotificationRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    UserNotificationRepository userNotificationRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserNotification>> getMyNotifications() {
        User user = getCurrentUser();
        List<UserNotification> list = userNotificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        User user = getCurrentUser();
        long count = userNotificationRepository.countByUserIdAndReadFalse(user.getId());
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable long id) {
        User user = getCurrentUser();
        UserNotification n = userNotificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        n.setRead(true);
        userNotificationRepository.save(n);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        User user = getCurrentUser();
        List<UserNotification> list = userNotificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        list.forEach(notification -> notification.setRead(true));
        userNotificationRepository.saveAll(list);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
