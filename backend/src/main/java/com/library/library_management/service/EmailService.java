package com.library.library_management.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        // For development: Log to console instead of sending actual email
        System.out.println("\n==============================================");
        System.out.println("PASSWORD RESET EMAIL");
        System.out.println("==============================================");
        System.out.println("To: " + toEmail);
        System.out.println("Reset Token: " + resetToken);
        System.out.println("Reset URL: http://localhost:34181/auth/reset-password?token=" + resetToken);
        System.out.println("This token will expire in 1 hour.");
        System.out.println("==============================================\n");
    }

    public void sendReturnReminder(String toEmail, String bookTitle, java.time.LocalDateTime dueDate) {
        System.out.println("\n==============================================");
        System.out.println("RETURN REMINDER EMAIL");
        System.out.println("==============================================");
        System.out.println("To: " + toEmail);
        System.out.println("Book: " + bookTitle);
        System.out.println("Due Date: " + dueDate);
        System.out.println("Message: Your book is due in 2 days. Please return it to avoid fines!");
        System.out.println("==============================================\n");
    }
}
