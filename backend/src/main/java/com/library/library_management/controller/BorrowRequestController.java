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
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return borrowRequestRepository.findByUserId(user.getId());
    }

    @PostMapping("/request/{bookId}")
    public ResponseEntity<?> requestBook(@PathVariable Long bookId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body("No copies available");
        }

        BorrowRequest request = BorrowRequest.builder()
                .user(user)
                .book(book)
                .requestDate(LocalDateTime.now())
                .status(BorrowRequest.BorrowStatus.PENDING_LIBRARIAN)
                .build();

        borrowRequestRepository.save(request);
        return ResponseEntity.ok("Request submitted successfully");
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<?> librarianReview(@PathVariable Long id, @RequestParam boolean approve) {
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
    public ResponseEntity<?> adminApprove(@PathVariable Long id, @RequestParam boolean approve) {
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
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        List<BorrowRequest> history = borrowRequestRepository.findByUserId(user.getId());
        return ResponseEntity.ok(history);
    }
}
