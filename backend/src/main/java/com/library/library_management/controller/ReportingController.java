package com.library.library_management.controller;

import com.library.library_management.model.BorrowRequest;
import com.library.library_management.repository.BorrowRequestRepository;
import com.library.library_management.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
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

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<byte[]> exportReport() throws IOException {
        List<BorrowRequest> allRequests = borrowRequestRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Library Report");

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] columns = { "User", "Email", "Book Title", "Start Date", "End Date", "Status", "Fine" };
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Data Rows
            int rowIdx = 1;
            for (BorrowRequest request : allRequests) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(request.getUser().getFullName());
                row.createCell(1).setCellValue(request.getUser().getEmail());
                row.createCell(2).setCellValue(request.getBook().getTitle());
                row.createCell(3)
                        .setCellValue(request.getRequestDate() != null ? request.getRequestDate().toString() : "");
                row.createCell(4).setCellValue(request.getDueDate() != null ? request.getDueDate().toString() : "");
                row.createCell(5).setCellValue(request.getStatus().toString());

                double fine = 0;
                if (request.getStatus() == BorrowRequest.BorrowStatus.OVERDUE ||
                        (request.getDueDate() != null && LocalDateTime.now().isAfter(request.getDueDate())
                                && request.getReturnDate() == null)) {
                    // Simple fine calculation: $1 per day overdue (placeholder logic)
                    long daysOverdue = java.time.Duration.between(request.getDueDate(), LocalDateTime.now()).toDays();
                    fine = Math.max(0, daysOverdue * 1.0);
                }
                row.createCell(6).setCellValue(fine);
            }

            workbook.write(out);
            byte[] content = out.toByteArray();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=library_report.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(content);
        }
    }
}
