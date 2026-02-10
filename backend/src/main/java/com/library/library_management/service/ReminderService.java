package com.library.library_management.service;

import com.library.library_management.model.BorrowRequest;
import com.library.library_management.repository.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private EmailService emailService;

    // Run every day at 9 AM (standard for reminders)
    // For demo/testing, you might want it more frequent or use a different trigger
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyReminders() {
        LocalDateTime now = LocalDateTime.now();

        List<BorrowRequest> activeRequests = borrowRequestRepository.findByStatus(BorrowRequest.BorrowStatus.APPROVED);

        for (BorrowRequest request : activeRequests) {
            if (request.getDueDate() != null) {
                long daysUntilDue = ChronoUnit.DAYS.between(now.toLocalDate(), request.getDueDate().toLocalDate());

                if (daysUntilDue == 2) {
                    emailService.sendReturnReminder(
                            request.getUser().getEmail(),
                            request.getBook().getTitle(),
                            request.getDueDate());
                }
            }
        }
    }
}
