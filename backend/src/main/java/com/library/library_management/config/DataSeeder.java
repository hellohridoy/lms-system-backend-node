package com.library.library_management.config;

import com.library.library_management.model.Book;
import com.library.library_management.model.User;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        UserRepository userRepository;

        @Autowired
        BookRepository bookRepository;

        @Autowired
        PasswordEncoder encoder;

        @Override
        public void run(String... args) throws Exception {
                if (userRepository.count() == 0) {
                        seedUsers();
                }
                if (bookRepository.count() == 0) {
                        seedBooks();
                }
        }

        private void seedUsers() {
                User admin = User.builder()
                                .username("admin")
                                .email("admin@library.com")
                                .password(encoder.encode("admin"))
                                .role(User.Role.ROLE_ADMIN)
                                .status(User.UserStatus.ACTIVE)
                                .build();

                User librarian = User.builder()
                                .username("librarian")
                                .email("librarian@library.com")
                                .password(encoder.encode("password"))
                                .role(User.Role.ROLE_LIBRARIAN)
                                .status(User.UserStatus.ACTIVE)
                                .build();

                User member = User.builder()
                                .username("member")
                                .email("member@library.com")
                                .password(encoder.encode("password"))
                                .role(User.Role.ROLE_MEMBER)
                                .status(User.UserStatus.ACTIVE)
                                .build();

                userRepository.saveAll(Arrays.asList(admin, librarian, member));
                System.out.println("Users seeded successfully.");
        }

        private void seedBooks() {
                Book b1 = createBook("Spring Microservices", "John Smith", "978-1111111111", "Spring Boot",
                                "Build scalable microservices with Spring Boot and Spring Cloud.",
                                "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=300",
                                5, 2022, "Spring", "Cloud");
                Book b2 = createBook("Laravel Up and Running", "Matt Stauffer", "978-2222222222", "Laravel",
                                "A framework for web artisans.",
                                "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=300",
                                3, 2019, "PHP", "Laravel");
                Book b3 = createBook("Python Crash Course", "Eric Matthes", "978-3333333333", "Python",
                                "A hands-on, project-based introduction to programming.",
                                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300",
                                10, 2019, "Python", "Beginner");
                Book b4 = createBook("Angular in Action", "Jeremy Wilken", "978-4444444444", "Angular",
                                "Learn Angular by building real-world applications.",
                                "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=300",
                                5, 2018, "Angular", "Frontend");
                Book b5 = createBook("React Design Patterns", "Michele Bertoli", "978-5555555555", "React",
                                "Build flexible and maintainable user interfaces with React.",
                                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300",
                                4, 2024, "React", "Frontend");
                Book b6 = createBook("Vue.js Up & Running", "Callum Macrae", "978-6666666666", "Vue",
                                "Building accessible, reactive user interfaces.",
                                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300",
                                6, 2018, "Vue", "Frontend");

                bookRepository.saveAll(Arrays.asList(b1, b2, b3, b4, b5, b6));
                System.out.println("Books seeded successfully.");
        }

        private Book createBook(String title, String author, String isbn, String genre, String synopsis,
                        String coverUrl, int copies, int year, String... tags) {
                return Book.builder()
                                .title(title)
                                .author(author)
                                .isbn(isbn)
                                .genre(genre)
                                .synopsis(synopsis)
                                .coverUrl(coverUrl)
                                .totalCopies(copies)
                                .availableCopies(copies)
                                .publicationYear(year)
                                .tags(new java.util.HashSet<>(Arrays.asList(tags)))
                                .build();
        }
}
