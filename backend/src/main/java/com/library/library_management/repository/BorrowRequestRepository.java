package com.library.library_management.repository;

import com.library.library_management.model.BorrowRequest;
import com.library.library_management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

    List<BorrowRequest> findByUserId(Long userId);

    List<BorrowRequest> findByStatus(BorrowRequest.BorrowStatus status);
}
