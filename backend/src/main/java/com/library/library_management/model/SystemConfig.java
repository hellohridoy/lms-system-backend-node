package com.library.library_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double fineRate; // Amount per day
    private Integer gracePeriod; // Days before fine begins
    private boolean autoApproveMembers;
    private boolean librarianRequestApprovalRequired;

    @Builder.Default
    private Integer defaultMemberBorrowingLimit = 3;

    @Builder.Default
    private Integer defaultLibrarianBorrowingLimit = 10;
}
