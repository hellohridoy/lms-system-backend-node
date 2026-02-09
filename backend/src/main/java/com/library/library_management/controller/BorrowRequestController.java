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
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body("No copies available");
        }

        List<BorrowRequest> activeRequests = borrowRequestRepository.findByUserId(user.getId()).stream()
                .filter(r -> r.getStatus() == BorrowRequest.BorrowStatus.APPROVED
                        || r.getStatus() == BorrowRequest.BorrowStatus.PENDING_LIBRARIAN
                        || r.getStatus() == BorrowRequest.BorrowStatus.PENDING_ADMIN)
                .toList();

        if (activeRequests.size() >= 5) {
            return ResponseEntity.badRequest().body("You have reached your borrowing limit of 5 books.");
        }

        BorrowRequest request = BorrowRequest.builder()
                .user(user)
                .book(book)
                .requestDate(LocalDateTime.now())
                .status(BorrowRequest.BorrowStatus.PENDING_LIBRARIAN)
                .isRenewal(false)
                .build();

        borrowRequestRepository.save(request);
        return ResponseEntity.ok("Request submitted successfully");
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

        return ResponseEntity.ok("Renewal request submitted successfully");
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
        return ResponseEntity.ok("Reviewed by librarian");
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
        return ResponseEntity.ok("Final decision by admin");
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<BorrowRequest>> getMyHistory() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<BorrowRequest> history = borrowRequestRepository.findByUserId(user.getId());

        // Dynamic fine calculation
        LocalDateTime now = LocalDateTime.now();
        for (BorrowRequest request : history) {
            if (request.getStatus() == BorrowRequest.BorrowStatus.APPROVED && request.getDueDate() != null) {
                if (now.isAfter(request.getDueDate())) {
                    long lateDays = java.time.Duration.between(request.getDueDate(), now).toDays();
                    request.setFineAmount((double) lateDays * 1.0); // $1 per day
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
        return ResponseEntity.ok("Fine paid successfully");
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable long userId, @RequestParam boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
        return ResponseEntity.ok("User status updated");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
