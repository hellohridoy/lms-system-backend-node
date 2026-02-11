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

        @Autowired
        com.library.library_management.repository.SystemConfigRepository systemConfigRepository;

        @Override
        public void run(String... args) throws Exception {
                if (userRepository.count() == 0) {
                        seedUsers();
                }
                if (bookRepository.count() == 0) {
                        seedBooks();
                }
                if (systemConfigRepository.count() == 0) {
                        seedConfig();
                }
                seedAdditionalBooks();
        }

        private void seedConfig() {
                com.library.library_management.model.SystemConfig config = com.library.library_management.model.SystemConfig
                                .builder()
                                .fineRate(1.0)
                                .gracePeriod(0)
                                .autoApproveMembers(false)
                                .librarianRequestApprovalRequired(true)
                                .defaultMemberBorrowingLimit(3)
                                .defaultLibrarianBorrowingLimit(10)
                                .build();
                systemConfigRepository.save(config);
                System.out.println("System configuration seeded successfully.");
        }

        private void seedUsers() {
                User admin = User.builder()
                                .username("admin")
                                .email("admin@library.com")
                                .password(encoder.encode("admin"))
                                .role(User.Role.ROLE_ADMIN)
                                .status(User.UserStatus.ACTIVE)
                                .borrowingLimit(Integer.MAX_VALUE)
                                .build();

                User librarian = User.builder()
                                .username("librarian")
                                .email("librarian@library.com")
                                .password(encoder.encode("password"))
                                .role(User.Role.ROLE_LIBRARIAN)
                                .status(User.UserStatus.ACTIVE)
                                .borrowingLimit(10)
                                .build();

                User member = User.builder()
                                .username("member")
                                .email("member@library.com")
                                .password(encoder.encode("password"))
                                .role(User.Role.ROLE_MEMBER)
                                .status(User.UserStatus.ACTIVE)
                                .borrowingLimit(3)
                                .build();

                userRepository.saveAll(Arrays.asList(admin, librarian, member));
                System.out.println("Users seeded successfully.");
        }

        private void seedBooks() {
                if (bookRepository.count() > 0)
                        return;

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

        private void seedAdditionalBooks() {
                if (bookRepository.existsByIsbn("978-REACT-001"))
                        return;

                java.util.List<Book> books = new java.util.ArrayList<>();

                // React
                books.add(createBook("React Pro", "Adam Freeman", "978-REACT-001", "React",
                                "Professional React development.",
                                "https://placehold.co/400x600/61DAFB/000000?text=React+Pro",
                                5, 2024, "React", "Frontend"));
                books.add(createBook("Learning React", "Alex Banks", "978-REACT-002", "React",
                                "Modern patterns for developing React apps.",
                                "https://placehold.co/400x600/61DAFB/000000?text=Learning+React",
                                8, 2023, "React", "Hooks"));
                books.add(createBook("The Road to React", "Robin Wieruch", "978-REACT-003", "React",
                                "Your journey to master React.js.",
                                "https://placehold.co/400x600/61DAFB/000000?text=Road+to+React",
                                10, 2023, "React", "Beginner"));
                books.add(createBook("React Hooks in Action", "John Limb", "978-REACT-004", "React", "Mastering hooks.",
                                "https://placehold.co/400x600/61DAFB/000000?text=React+Hooks",
                                4, 2022, "React", "Hooks"));
                books.add(createBook("Fullstack React", "Anthony Accomazzo", "978-REACT-005", "React",
                                "The complete guide to ReactJS and friends.",
                                "https://placehold.co/400x600/61DAFB/000000?text=Fullstack+React",
                                6, 2021, "React", "Fullstack"));
                books.add(createBook("React Native in Action", "Nader Dabit", "978-REACT-006", "React Native",
                                "Building native mobile apps with React.",
                                "https://placehold.co/400x600/61DAFB/000000?text=React+Native",
                                5, 2020, "React Native", "Mobile"));
                books.add(createBook("Advanced React", "M. Larose", "978-REACT-007", "React",
                                "Deep dive into React internals.",
                                "https://placehold.co/400x600/61DAFB/000000?text=Advanced+React",
                                3, 2024, "React", "Advanced"));
                books.add(createBook("Testing React Apps", "Kent C. Dodds", "978-REACT-008", "React",
                                "Testing strategies for React.",
                                "https://placehold.co/400x600/61DAFB/000000?text=Testing+React",
                                7, 2023, "React", "Testing"));
                books.add(createBook("React Design Systems", "Emma Bostian", "978-REACT-009", "React",
                                "Building reusable components.",
                                "https://placehold.co/400x600/61DAFB/000000?text=React+Design",
                                4, 2025, "React", "Design"));
                books.add(createBook("React Performance", "Perf Expert", "978-REACT-010", "React",
                                "Optimizing React applications.",
                                "https://placehold.co/400x600/61DAFB/000000?text=React+Perf",
                                6, 2024, "React", "Performance"));

                // Frontend Others
                books.add(createBook("Next.js 14 Guide", "Tim Neutkens", "978-NEXT-001", "Next.js",
                                "The fullstack React framework.",
                                "https://placehold.co/400x600/000000/FFFFFF?text=Next.js+14",
                                5, 2024, "Next.js", "Frontend"));
                books.add(createBook("Mastering Next.js", "Lee Robinson", "978-NEXT-002", "Next.js",
                                "Server components and more.",
                                "https://placehold.co/400x600/000000/FFFFFF?text=Mastering+Next.js",
                                7, 2023, "Next.js", "Vercel"));
                books.add(createBook("Tailwind CSS Labs", "Adam Wathan", "978-TAILWIND-001", "Tailwind",
                                "Rapidly build modern websites.",
                                "https://placehold.co/400x600/38B2AC/FFFFFF?text=Tailwind+CSS",
                                8, 2023, "Tailwind", "CSS"));

                // Backend
                books.add(createBook("Node.js Design Patterns", "Mario Casciaro", "978-NODE-001", "Node.js",
                                "Master Node.js.",
                                "https://placehold.co/400x600/339933/FFFFFF?text=Node.js+Design",
                                6, 2022, "Node.js", "Backend"));
                books.add(createBook("Mastering Node.js", "TJ Holowaychuk", "978-NODE-002", "Node.js",
                                "Advanced Node.js.",
                                "https://placehold.co/400x600/339933/FFFFFF?text=Mastering+Node.js",
                                4, 2021, "Node.js", "Backend"));
                books.add(createBook("The Go Programming Language", "Alan Donovan", "978-GO-001", "Go",
                                "The definitive guide.",
                                "https://placehold.co/400x600/00ADD8/FFFFFF?text=Go+Lang",
                                10, 2020, "Go", "Backend"));
                books.add(createBook("Go in Action", "William Kennedy", "978-GO-002", "Go",
                                "Go in practice.",
                                "https://placehold.co/400x600/00ADD8/FFFFFF?text=Go+In+Action",
                                5, 2019, "Go", "Backend"));

                // Mobile
                books.add(createBook("Flutter Apprentice", "Mike Katz", "978-FLUTTER-001", "Flutter",
                                "Build iOS and Android Apps.",
                                "https://placehold.co/400x600/02569B/FFFFFF?text=Flutter+Apprentice",
                                5, 2024, "Flutter", "Mobile"));
                books.add(createBook("Kotlin in Action", "Dmitry Jemerov", "978-KOTLIN-001", "Kotlin",
                                "Kotlin for JVM and Android.",
                                "https://placehold.co/400x600/7F52FF/FFFFFF?text=Kotlin+In+Action",
                                8, 2021, "Kotlin", "Android"));
                books.add(createBook("Head First Kotlin", "Dawn Griffiths", "978-KOTLIN-002", "Kotlin",
                                "A brain-friendly guide.",
                                "https://placehold.co/400x600/7F52FF/FFFFFF?text=Head+First+Kotlin",
                                6, 2022, "Kotlin", "Android"));
                books.add(createBook("Mastering Swift", "Jon Hoffman", "978-SWIFT-001", "Swift",
                                "Deep dive into Swift.",
                                "https://placehold.co/400x600/FA7343/FFFFFF?text=Mastering+Swift",
                                5, 2023, "Swift", "iOS"));
                books.add(createBook("SwiftUI Apprentice", "Audrey Tam", "978-SWIFT-002", "Swift",
                                "Declarative UI for Apple devices.",
                                "https://placehold.co/400x600/FA7343/FFFFFF?text=SwiftUI",
                                7, 2024, "Swift", "iOS"));

                // Databases
                books.add(createBook("PostgreSQL 16 Administration", "Hans-Jürgen Schönig", "978-PG-001", "PostgreSQL",
                                "Managing PostgreSQL.",
                                "https://placehold.co/400x600/336791/FFFFFF?text=PostgreSQL+Admin",
                                4, 2024, "PostgreSQL", "Database"));
                books.add(createBook("MongoDB: The Definitive Guide", "Shannon Bradshaw", "978-MONGO-001", "MongoDB",
                                "Powerful and Scalable Data Storage.",
                                "https://placehold.co/400x600/47A248/FFFFFF?text=MongoDB+Guide",
                                6, 2022, "MongoDB", "NoSQL"));
                books.add(createBook("High Performance MySQL", "Silvia Botros", "978-MYSQL-001", "MySQL",
                                "Optimization, Backups, and Replication.",
                                "https://placehold.co/400x600/4479A1/FFFFFF?text=High+Perf+MySQL",
                                5, 2021, "MySQL", "Database"));
                books.add(createBook("Redis in Action", "Josiah L. Carlson", "978-REDIS-001", "Redis",
                                "Fast scalable data storage.",
                                "https://placehold.co/400x600/DC382D/FFFFFF?text=Redis+In+Action",
                                5, 2020, "Redis", "Cache"));

                // DevOps & Cloud
                books.add(createBook("Container Security", "Liz Rice", "978-DOCKER-001", "Docker",
                                "Fundamental technology concepts.",
                                "https://placehold.co/400x600/2496ED/FFFFFF?text=Container+Security",
                                5, 2020, "Docker", "DevOps"));
                books.add(createBook("Kubernetes: Up and Running", "Kelsey Hightower", "978-K8S-001", "Kubernetes",
                                "Dive into the future of infrastructure.",
                                "https://placehold.co/400x600/326CE5/FFFFFF?text=Kubernetes",
                                5, 2022, "Kubernetes", "DevOps"));
                books.add(createBook("AWS Certified Solutions Architect", "Ben Piper", "978-AWS-001", "AWS",
                                "Study guide.",
                                "https://placehold.co/400x600/FF9900/000000?text=AWS+Architect",
                                10, 2023, "AWS", "Cloud"));
                books.add(createBook("Azure Fundamentals", "Jim Cheshire", "978-AZURE-001", "Azure",
                                "Exam AZ-900.",
                                "https://placehold.co/400x600/007FFF/FFFFFF?text=Azure+Fundamentals",
                                8, 2022, "Azure", "Cloud"));

                bookRepository.saveAll(books);
                System.out.println("Additional books seeded successfully.");
        }
}
