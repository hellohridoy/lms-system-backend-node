package com.library.library_management.controller;

import com.library.library_management.model.BorrowRequest;
import com.library.library_management.repository.BorrowRequestRepository;
import com.library.library_management.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportingController {
    @Autowired
    BorrowRequestRepository borrowRequestRepository;

    @Autowired
    BookRepository bookRepository;

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public List<BorrowRequest> getOverdueLedger() {
        return borrowRequestRepository.findByStatus(BorrowRequest.BorrowStatus.OVERDUE);
    }

    @GetMapping("/inventory-heatmap")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getInventoryHeatmap() {
        List<BorrowRequest> allRequests = borrowRequestRepository.findAll();
        Map<String, Long> genreStats = allRequests.stream()
                .collect(Collectors.groupingBy(r -> r.getBook().getGenre(), Collectors.counting()));

        return ResponseEntity.ok(genreStats);
    }

    @GetMapping("/audit-trail")
    @PreAuthorize("hasRole('ADMIN')")
    public List<BorrowRequest> getAuditTrail() {
        // In a real app, we might have a separate AuditLog entity.
        // For now, we return approved/rejected requests as they contain approval
        // details.
        return borrowRequestRepository.findAll().stream()
                .filter(r -> r.getStatus() == BorrowRequest.BorrowStatus.APPROVED
                        || r.getStatus() == BorrowRequest.BorrowStatus.REJECTED
                        || r.getStatus() == BorrowRequest.BorrowStatus.RETURNED)
                .sorted(Comparator.comparing(BorrowRequest::getRequestDate).reversed())
                .collect(Collectors.toList());
    }
}
