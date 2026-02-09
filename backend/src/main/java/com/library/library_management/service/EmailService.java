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

        // TODO: For production, implement actual email sending using JavaMailSender
        // Example with Gmail SMTP:
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(toEmail);
        // message.setSubject("Password Reset Request");
        // message.setText("Click the link to reset your password:
        // http://localhost:34181/auth/reset-password?token=" + resetToken);
        // mailSender.send(message);
    }
}
