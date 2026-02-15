package com.library.library_management.controller;

import com.library.library_management.model.Book;
import com.library.library_management.model.BorrowRequest;
import com.library.library_management.model.User;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.BorrowRequestRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/borrows")
public class BorrowRequestController {
    @Autowired
    BorrowRequestRepository borrowRequestRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    com.library.library_management.repository.SystemConfigRepository systemConfigRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public List<BorrowRequest> getAllRequests(@RequestParam(required = false) BorrowRequest.BorrowStatus status) {
        if (status != null) {
            return borrowRequestRepository.findByStatus(status);
        }
        return borrowRequestRepository.findAll();
    }

    @GetMapping("/my")
    public List<BorrowRequest> getMyRequests() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowRequestRepository.findByUserId(user.getId());
    }

    @PostMapping("/request/{bookId}")
    public ResponseEntity<?> requestBook(@PathVariable long bookId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ROLE_GUEST) {
            return ResponseEntity.status(403).body("Guests cannot request books");
        }
        if (user.getRole() == User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Admins cannot borrow books. Only members and librarians can borrow.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body("No copies available");
        }

        List<BorrowRequest> activeRequests = borrowRequestRepository.findByUserId(user.getId()).stream()
                .filter(r -> r.getStatus() == BorrowRequest.BorrowStatus.APPROVED
                        || r.getStatus() == BorrowRequest.BorrowStatus.PENDING_LIBRARIAN
                        || r.getStatus() == BorrowRequest.BorrowStatus.PENDING_ADMIN
                        || r.getStatus() == BorrowRequest.BorrowStatus.OVERDUE)
                .toList();

        int limit = user.getBorrowingLimit() != null ? user.getBorrowingLimit() : 3;
        if (activeRequests.size() >= limit) {
            return ResponseEntity.badRequest().body("You have reached your borrowing limit of " + limit + " books.");
        }

        BorrowRequest.BorrowStatus initialStatus = BorrowRequest.BorrowStatus.PENDING_LIBRARIAN;
        if (user.getRole() == User.Role.ROLE_LIBRARIAN) {
            initialStatus = BorrowRequest.BorrowStatus.PENDING_ADMIN;
        } else if (user.getRole() == User.Role.ROLE_ADMIN) {
            initialStatus = BorrowRequest.BorrowStatus.APPROVED;
        }

        com.library.library_management.model.SystemConfig config = systemConfigRepository.findCurrentConfig()
                .orElse(null);
        if (config != null && config.isAutoApproveMembers() && user.getRole() == User.Role.ROLE_MEMBER) {
            initialStatus = BorrowRequest.BorrowStatus.APPROVED;
        }

        BorrowRequest request = BorrowRequest.builder()
                .user(user)
                .book(book)
                .requestDate(LocalDateTime.now())
                .status(initialStatus)
                .isRenewal(false)
                .build();

        if (initialStatus == BorrowRequest.BorrowStatus.APPROVED) {
            request.setApprovalDate(LocalDateTime.now());
            request.setDueDate(LocalDateTime.now().plusDays(14));
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        }

        borrowRequestRepository.save(request);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Request submitted successfully. Status: " + initialStatus);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/renew/{id}")
    public ResponseEntity<?> requestRenewal(@PathVariable long id) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow request not found"));

        if (borrowRequest.getStatus() != BorrowRequest.BorrowStatus.APPROVED) {
            return ResponseEntity.badRequest().body("Only active borrowings can be renewed");
        }

        borrowRequest.setStatus(BorrowRequest.BorrowStatus.PENDING_LIBRARIAN);
        borrowRequest.setRenewal(true);
        borrowRequestRepository.save(borrowRequest);

        return ResponseEntity
                .ok(java.util.Collections.singletonMap("message", "Renewal request submitted successfully"));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<?> librarianReview(@PathVariable long id, @RequestParam boolean approve) {
        BorrowRequest request = borrowRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (approve) {
            request.setStatus(BorrowRequest.BorrowStatus.PENDING_ADMIN);
        } else {
            request.setStatus(BorrowRequest.BorrowStatus.REJECTED);
        }

        borrowRequestRepository.save(request);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Reviewed by librarian"));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminApprove(@PathVariable long id, @RequestParam boolean approve) {
        BorrowRequest request = borrowRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (approve) {
            request.setStatus(BorrowRequest.BorrowStatus.APPROVED);
            request.setApprovalDate(LocalDateTime.now());
            request.setDueDate(LocalDateTime.now().plusDays(14));

            Book book = request.getBook();
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        } else {
            request.setStatus(BorrowRequest.BorrowStatus.REJECTED);
        }

        borrowRequestRepository.save(request);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Final decision by admin"));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<BorrowRequest>> getMyHistory() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<BorrowRequest> history = borrowRequestRepository.findByUserId(user.getId());

        // Dynamic fine calculation
        com.library.library_management.model.SystemConfig config = systemConfigRepository.findCurrentConfig()
                .orElse(null);
        double fineRate = config != null ? config.getFineRate() : 1.0;
        int gracePeriod = config != null ? config.getGracePeriod() : 0;

        LocalDateTime now = LocalDateTime.now();
        for (BorrowRequest request : history) {
            if (request.getStatus() == BorrowRequest.BorrowStatus.APPROVED && request.getDueDate() != null) {
                if (now.isAfter(request.getDueDate().plusDays(gracePeriod))) {
                    long lateDays = java.time.Duration.between(request.getDueDate().plusDays(gracePeriod), now)
                            .toDays();
                    request.setFineAmount((double) lateDays * fineRate);
                    if (lateDays > 0) {
                        request.setStatus(BorrowRequest.BorrowStatus.OVERDUE);
                        borrowRequestRepository.save(request);
                    }
                }
            }
        }
        return ResponseEntity.ok(history);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<BorrowRequest> myRequests = borrowRequestRepository.findByUserId(user.getId());

        double totalFine = 0;
        int dueSoon = 0;
        LocalDateTime now = LocalDateTime.now();

        for (BorrowRequest request : myRequests) {
            Double fine = request.getFineAmount();
            if (fine != null) {
                totalFine += fine;
            }
            if (request.getStatus() == BorrowRequest.BorrowStatus.APPROVED && request.getDueDate() != null) {
                if (request.getDueDate().isAfter(now) && request.getDueDate().isBefore(now.plusDays(3))) {
                    dueSoon++;
                }
            }
        }

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalFine", totalFine);
        stats.put("dueSoon", dueSoon);
        stats.put("totalBorrowed", myRequests.size());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payFine(@PathVariable long id) {
        BorrowRequest request = borrowRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setFinePaid(true);
        request.setFineAmount(0.0);
        borrowRequestRepository.save(request);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Fine paid successfully"));
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable long userId, @RequestParam boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "User status updated"));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
