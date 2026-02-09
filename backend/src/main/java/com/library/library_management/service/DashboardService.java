package com.library.library_management.service;

import com.library.library_management.dto.DashboardStatsDTO;
import com.library.library_management.model.BorrowRequest;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.BorrowRequestRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    public DashboardStatsDTO getStats() {
        long totalBooks = bookRepository.count();
        long activeMembers = userRepository.count();
        long pendingRequests = borrowRequestRepository.findByStatus(BorrowRequest.BorrowStatus.PENDING_LIBRARIAN).size()
                +
                borrowRequestRepository.findByStatus(BorrowRequest.BorrowStatus.PENDING_ADMIN).size();

        List<DashboardStatsDTO.RecentActivityDTO> recentActivities = borrowRequestRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getRequestDate().compareTo(a.getRequestDate()))
                .limit(5)
                .map(req -> DashboardStatsDTO.RecentActivityDTO.builder()
                        .user(req.getUser().getUsername())
                        .action("requested \"" + req.getBook().getTitle() + "\"")
                        .timeAgo(formatTimeAgo(req.getRequestDate()))
                        .status(req.getStatus().name())
                        .build())
                .collect(Collectors.toList());

        List<DashboardStatsDTO.PopularBookDTO> popularBooks = bookRepository.findAll()
                .stream()
                .limit(5) // Just returning first 5 for now as we don't have borrow count yet
                .map(book -> DashboardStatsDTO.PopularBookDTO.builder()
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .coverUrl(book.getCoverUrl())
                        .borrowCount(10) // Mock count
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalBooks(totalBooks)
                .activeMembers(activeMembers)
                .pendingRequests(pendingRequests)
                .overdueFines(0.0) // Placeholder
                .recentActivities(recentActivities)
                .popularBooks(popularBooks)
                .build();
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        // Simple formatter for demo purposes
        return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"));
    }
}
