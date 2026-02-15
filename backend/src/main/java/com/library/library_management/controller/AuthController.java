package com.library.library_management.controller;

import com.library.library_management.dto.AuthDto.*;
import com.library.library_management.model.PasswordResetToken;
import com.library.library_management.model.User;
import com.library.library_management.repository.PasswordResetTokenRepository;
import com.library.library_management.repository.UserRepository;
import com.library.library_management.security.JwtUtils;
import com.library.library_management.service.EmailService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                .getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).get();

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRegistrationDate()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .address(signUpRequest.getAddress())
                .status(User.UserStatus.ACTIVE)
                .registrationDate(java.time.LocalDate.now())
                .build();

        String strRole = signUpRequest.getRole();
        if (strRole == null) {
            user.setRole(User.Role.ROLE_MEMBER);
        } else {
            user.setRole(User.Role.valueOf(strRole));
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            // Return success even if email doesn't exist (security best practice)
            return ResponseEntity.ok(new MessageResponse("If the email exists, a password reset link has been sent."));
        }

        User user = userOpt.get();

        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Send email (logs to console in development)
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.ok(new MessageResponse("If the email exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(request.getToken());

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired reset token."));
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.isExpired() || resetToken.isUsed()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired reset token."));
        }

        // Update user password
        User user = resetToken.getUser();
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully!"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        // For development: Create/login user with Google ID
        // In production, you would verify the idToken with Google's API

        // Extract email from token (simplified for demo)
        // In production: Use Google's token verification library
        String email = "google.user@example.com"; // Placeholder
        String username = "google_" + UUID.randomUUID().toString().substring(0, 8);

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Create new user from Google account
            user = User.builder()
                    .username(username)
                    .email(email)
                    .password(encoder.encode(UUID.randomUUID().toString())) // Random password
                    .role(User.Role.ROLE_MEMBER)
                    .status(User.UserStatus.ACTIVE)
                    .build();
            userRepository.save(user);
        }

        // Generate JWT token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(), null, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRegistrationDate()));
    }
}
