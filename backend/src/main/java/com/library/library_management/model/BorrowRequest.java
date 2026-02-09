package com.library.library_management.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private LocalDateTime requestDate;
    private LocalDateTime approvalDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private Double fineAmount;
    private boolean isRenewal;
    private boolean finePaid;

    @Enumerated(EnumType.STRING)
    private BorrowStatus status;

    public enum BorrowStatus {
        PENDING_LIBRARIAN,
        PENDING_ADMIN,
        APPROVED,
        REJECTED,
        RETURNED,
        OVERDUE
    }
}
