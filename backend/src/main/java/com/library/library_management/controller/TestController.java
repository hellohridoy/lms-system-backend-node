package com.library.library_management.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/auth")
    public String testAuth() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                return "Authenticated as: " + userDetails.getUsername() +
                        " with authorities: " + userDetails.getAuthorities();
            } else {
                return "Principal: " + principal.toString();
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @GetMapping("/public")
    public String testPublic() {
        return "Public endpoint works!";
    }
}
