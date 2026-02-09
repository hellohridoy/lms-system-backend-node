package com.library.library_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalBooks;
    private long activeMembers;
    private long pendingRequests;
    private double overdueFines; // Fixed for now or calculated if possible
    private List<RecentActivityDTO> recentActivities;
    private List<PopularBookDTO> popularBooks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityDTO {
        private String user;
        private String action;
        private String timeAgo;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PopularBookDTO {
        private String title;
        private String author;
        private String coverUrl;
        private int borrowCount;
    }
}
