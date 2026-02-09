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
                long pendingRequests = borrowRequestRepository
                                .findByStatus(BorrowRequest.BorrowStatus.PENDING_LIBRARIAN).size()
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

                double overdueFines = borrowRequestRepository.findAll().stream()
                                .filter(r -> r.getFineAmount() != null)
                                .mapToDouble(BorrowRequest::getFineAmount)
                                .sum();

                List<DashboardStatsDTO.PopularBookDTO> popularBooks = borrowRequestRepository.findAll().stream()
                                .collect(Collectors.groupingBy(BorrowRequest::getBook, Collectors.counting()))
                                .entrySet().stream()
                                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                                .limit(5)
                                .map(entry -> DashboardStatsDTO.PopularBookDTO.builder()
                                                .title(entry.getKey().getTitle())
                                                .author(entry.getKey().getAuthor())
                                                .coverUrl(entry.getKey().getCoverUrl())
                                                .borrowCount(entry.getValue().intValue())
                                                .build())
                                .collect(Collectors.toList());

                return DashboardStatsDTO.builder()
                                .totalBooks(totalBooks)
                                .activeMembers(activeMembers)
                                .pendingRequests(pendingRequests)
                                .overdueFines(overdueFines)
                                .recentActivities(recentActivities)
                                .popularBooks(popularBooks)
                                .build();
        }

        private String formatTimeAgo(LocalDateTime dateTime) {
                // Simple formatter for demo purposes
                return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"));
        }
}
