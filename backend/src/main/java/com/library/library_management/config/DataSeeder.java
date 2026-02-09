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
        Book b1 = Book.builder()
                .title("Spring Microservices")
                .author("John Smith")
                .isbn("978-1111111111")
                .genre("Spring Boot")
                .synopsis("Build scalable microservices with Spring Boot and Spring Cloud.")
                .coverUrl(
                        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=300")
                .totalCopies(5)
                .availableCopies(5)
                .build();

        Book b2 = Book.builder()
                .title("Laravel Up and Running")
                .author("Matt Stauffer")
                .isbn("978-2222222222")
                .genre("Laravel")
                .synopsis("A framework for web artisans.")
                .coverUrl(
                        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=300")
                .totalCopies(3)
                .availableCopies(2)
                .build();

        Book b3 = Book.builder()
                .title("Python Crash Course")
                .author("Eric Matthes")
                .isbn("978-3333333333")
                .genre("Python")
                .synopsis("A hands-on, project-based introduction to programming.")
                .coverUrl(
                        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300")
                .totalCopies(10)
                .availableCopies(10)
                .build();

        Book b4 = Book.builder()
                .title("Angular in Action")
                .author("Jeremy Wilken")
                .isbn("978-4444444444")
                .genre("Angular")
                .synopsis("Learn Angular by building real-world applications.")
                .coverUrl(
                        "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=300")
                .totalCopies(5)
                .availableCopies(5)
                .build();

        Book b5 = Book.builder()
                .title("React Design Patterns")
                .author("Michele Bertoli")
                .isbn("978-5555555555")
                .genre("React")
                .synopsis("Build flexible and maintainable user interfaces with React.")
                .coverUrl(
                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300")
                .totalCopies(4)
                .availableCopies(4)
                .build();

        Book b6 = Book.builder()
                .title("Vue.js Up & Running")
                .author("Callum Macrae")
                .isbn("978-6666666666")
                .genre("Vue")
                .synopsis("Building accessible, reactive user interfaces.")
                .coverUrl(
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300")
                .totalCopies(6)
                .availableCopies(6)
                .build();

        bookRepository.saveAll(Arrays.asList(b1, b2, b3, b4, b5, b6));
        System.out.println("Books seeded successfully.");
    }
}
