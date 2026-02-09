package com.library.library_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String isbn;
    private String genre;

    @Column(length = 2000)
    private String synopsis;

    private String coverUrl;
    private Integer totalCopies;
    private Integer availableCopies;

    private Integer publicationYear;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "book_tags", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "tag")
    private java.util.Set<String> tags = new java.util.HashSet<>();
}
