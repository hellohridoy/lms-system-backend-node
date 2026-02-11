package com.library.library_management.dto;

import lombok.Data;
import java.util.List;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String role;
        private String fullName;
        private String phoneNumber;
        private String address;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private Long id;
        private String username;
        private String email;
        private String role;
        private String fullName;
        private String phoneNumber;
        private String address;
        private java.time.LocalDate registrationDate;

        public JwtResponse(String token, Long id, String username, String email, String role, String fullName,
                String phoneNumber, String address, java.time.LocalDate registrationDate) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.fullName = fullName;
            this.phoneNumber = phoneNumber;
            this.address = address;
            this.registrationDate = registrationDate;
        }
    }

    @Data
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }

    @Data
    public static class GoogleLoginRequest {
        private String idToken;
    }
}
