package com.library.library_management.controller;

import com.library.library_management.model.SystemConfig;
import com.library.library_management.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/config")
public class SystemConfigController {
    @Autowired
    SystemConfigRepository systemConfigRepository;

    @GetMapping
    public ResponseEntity<SystemConfig> getConfig() {
        return ResponseEntity.ok(systemConfigRepository.findCurrentConfig()
                .orElse(SystemConfig.builder()
                        .fineRate(1.0)
                        .gracePeriod(0)
                        .autoApproveMembers(false)
                        .librarianRequestApprovalRequired(true)
                        .build()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateConfig(@RequestBody SystemConfig config) {
        SystemConfig current = systemConfigRepository.findCurrentConfig().orElse(new SystemConfig());
        current.setFineRate(config.getFineRate());
        current.setGracePeriod(config.getGracePeriod());
        current.setAutoApproveMembers(config.isAutoApproveMembers());
        current.setLibrarianRequestApprovalRequired(config.isLibrarianRequestApprovalRequired());
        current.setDefaultMemberBorrowingLimit(config.getDefaultMemberBorrowingLimit());
        current.setDefaultLibrarianBorrowingLimit(config.getDefaultLibrarianBorrowingLimit());

        systemConfigRepository.save(current);
        return ResponseEntity.ok("Configuration updated successfully");
    }
}
